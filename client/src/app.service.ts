import { Injectable } from "@nestjs/common/decorators";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { Logger } from "@nestjs/common/services";
import { createClient, FailoverStrategy, SignatureProvider, newSignatureProvider, encryption, KeyPair, gtv } from "postchain-client";
import { Operation, TransactionReceipt } from '../node_modules/postchain-client/built/src/blockchainClient/types';
import { ChainResDto, KeyPairDto } from './app.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  async restClient() {
    // const nodeUrl: string[] = process.env.BLOCLCHAIN_API_URL.split(',');
    const nodeUrl: string[] = ['http://localhost:7730'];
    const client = await createClient({
            nodeUrlPool: nodeUrl,
            blockchainRid: 'FCC81FE47B0C47D6EDB9D672830E9BBA90C6C72B390945F19CB2B8F5EB2769F0',
            // blockchainRid: process.env.BLOCKCHAIN_RID,
            // blockchainIid: 0,
            statusPollInterval: 500,
            statusPollCount: 20,
            failOverConfig: {
                strategy: FailoverStrategy.TryNextOnError,
                attemptsPerEndpoint: 3,
                attemptInterval: 1000,
                unreachableDuration: 180000,
            }
        });
        this.logger.debug(`client: ${JSON.stringify(client)}`);
        return client;
    };


    async chainOperation(payload: Operation, signerPrivKey?: SignatureProvider): Promise<ChainResDto> {
        const client = await this.restClient();
        const signatureProvider: SignatureProvider = signerPrivKey ? signerPrivKey : newSignatureProvider({ privKey: process.env.SIGNER_PRIVKEY });
        const currentDate = new Date();
        const receipt: TransactionReceipt = await client.signAndSendUniqueTransaction(
            payload,
            signatureProvider
        ).on("sent", (receipt: TransactionReceipt) => {
            this.logger.log(`sent tx: ${JSON.stringify(receipt)}`);
        }).catch((err: any) => {
            this.logger.log(`res: ${JSON.stringify(err)}`);
            if (err.shortReason) {
                switch (err.shortReason) {
                    default:
                        throw new HttpException({ status: 'reject', massage: err.shortReason }, HttpStatus.BAD_REQUEST);
                };
            } else {
                this.logger.error('err: ', err.message);
                const statusCodeMatch: string = err.message.match(/Code: (\d+)/);

                let statusCode: number;
                statusCodeMatch && statusCodeMatch[1].length > 1 ? statusCode = parseInt(statusCodeMatch[1]) : this.logger.error(`not massage Code: ${err.message}`);

                const messageMatch = err.message.match(/'text':\s*(.*?)(?=})/);
                this.logger.debug('messageMatch: ', messageMatch);
                const message = messageMatch[1];

                throw new HttpException({ status: 'reject', massage: message }, statusCode);
            };
        });

        this.logger.log(`res: ${JSON.stringify(receipt)}`);
        this.logger.log(`transactionRid: ${JSON.stringify(receipt.transactionRid.toString('hex'))}`);
        return {
            status: receipt.status,
            txId: receipt.transactionRid.toString('hex'),
            timestamp: currentDate.getTime()
        };
    };
    
    async generateECDSAKey(): Promise<KeyPairDto> {
        const keypair: KeyPair = encryption.makeKeyPair();

        return {
            privKey: keypair.privKey.toString('hex'),
            pubKey: keypair.pubKey.toString('hex')
        };
    };

    async register({ privKey, pubKey, role }: {
      privKey: string,
      pubKey: string,
      role: number
    }): Promise<ChainResDto> {
      const signerPrivKey = newSignatureProvider({ privKey: privKey });
      const payload: Operation = {
            name: "register",
            args: [
              pubKey,
              role
            ],
        };
      return await this.chainOperation(payload, signerPrivKey);
    }
}
