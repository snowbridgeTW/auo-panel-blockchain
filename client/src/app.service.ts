import { Injectable } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import {
  createClient,
  FailoverStrategy,
  SignatureProvider,
  newSignatureProvider,
  encryption,
  KeyPair,
} from 'postchain-client';
import {
  Operation,
  QueryObject,
  TransactionReceipt,
} from '../node_modules/postchain-client/built/src/blockchainClient/types';
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
      blockchainRid:
        '406E25D09986E5A9CEBA3778E9FE64F05C57BBF16D1578ACA2F85BFF5AF48E07',
      // blockchainRid: process.env.BLOCKCHAIN_RID,
      // blockchainIid: 0,
      statusPollInterval: 500,
      statusPollCount: 20,
      failOverConfig: {
        strategy: FailoverStrategy.TryNextOnError,
        attemptsPerEndpoint: 3,
        attemptInterval: 1000,
        unreachableDuration: 180000,
      },
    });
    this.logger.debug(`client: ${JSON.stringify(client)}`);
    return client;
  }

  async chainOperation(
    payload: Operation,
    signerPrivKey?: SignatureProvider,
  ): Promise<ChainResDto> {
    const client = await this.restClient();
    // const signatureProvider: SignatureProvider = signerPrivKey
    //   ? signerPrivKey
    //   : newSignatureProvider({ privKey: process.env.SIGNER_PRIVKEY });
    const currentDate = new Date();
    const receipt: TransactionReceipt = await client
      //   .signAndSendUniqueTransaction(payload, signatureProvider)
      .signAndSendUniqueTransaction(payload, signerPrivKey)
      .on('sent', (receipt: TransactionReceipt) => {
        this.logger.log(`sent tx: ${JSON.stringify(receipt)}`);
      })
      .catch((err: any) => {
        this.logger.log(`res: ${JSON.stringify(err)}`);
        if (err.shortReason) {
          switch (err.shortReason) {
            default:
              throw new HttpException(
                { status: 'reject', massage: err.shortReason },
                HttpStatus.BAD_REQUEST,
              );
          }
        } else {
          this.logger.error('err: ', err.message);
          const statusCodeMatch: string = err.message.match(/Code: (\d+)/);

          let statusCode: number;
          statusCodeMatch && statusCodeMatch[1].length > 1
            ? (statusCode = parseInt(statusCodeMatch[1]))
            : this.logger.error(`not massage Code: ${err.message}`);

          const messageMatch = err.message.match(/'text':\s*(.*?)(?=})/);
          this.logger.debug('messageMatch: ', messageMatch);
          const message = messageMatch[1];

          throw new HttpException(
            { status: 'reject', massage: message },
            statusCode,
          );
        }
      });

    this.logger.log(`res: ${JSON.stringify(receipt)}`);
    this.logger.log(
      `transactionRid: ${JSON.stringify(receipt.transactionRid.toString('hex'))}`,
    );
    return {
      status: receipt.status,
      txId: receipt.transactionRid.toString('hex'),
      timestamp: currentDate.getTime(),
    };
  }

  async generateECDSAKey(): Promise<KeyPairDto> {
    const keypair: KeyPair = encryption.makeKeyPair();

    return {
      privKey: keypair.privKey.toString('hex'),
      pubKey: keypair.pubKey.toString('hex'),
    };
  }

  async register({
    privKey,
    pubKey,
    role,
  }: {
    privKey: string;
    pubKey: string;
    role: number; // 0: AUO; 1:OTHER; 2:CHANNEL; 3:WALLET
  }): Promise<ChainResDto> {
    const signerPrivKey = newSignatureProvider({ privKey: privKey });
    const payload: Operation = {
      name: 'register',
      args: [pubKey, role],
    };
    return await this.chainOperation(payload, signerPrivKey);
  }

  async mintAsset({
    privKey,
    pubKey,
    name,
    serialId,
    metaCID,
  }: {
    privKey: string;
    pubKey: string;
    name: string;
    serialId: string;
    metaCID: string;
  }): Promise<ChainResDto> {
    const signerPrivKey = newSignatureProvider({ privKey: privKey });
    const payload: Operation = {
      name: 'mintAsset',
      args: [name, serialId, metaCID, Buffer.from(pubKey, 'hex')],
    };
    return await this.chainOperation(payload, signerPrivKey);
  }

  async createProduct({
    privKey,
    pubKey,
    targetAddress,
    nftsMeta,
    message,
  }: {
    privKey: string;
    pubKey: string;
    targetAddress: string;
    nftsMeta: string;
    message: string;
  }): Promise<ChainResDto> {
    const signerPrivKey = newSignatureProvider({ privKey: privKey });
    const payload: Operation = {
      name: 'createProduct',
      args: [
        Buffer.from(pubKey, 'hex'),
        Buffer.from(targetAddress, 'hex'),
        nftsMeta,
        message,
      ],
    };
    return await this.chainOperation(payload, signerPrivKey);
  }

  async batchTransfer({
    privKey,
    pubKey,
    assetIds,
    from,
    to,
  }: {
    privKey: string;
    pubKey: string;
    assetIds: [string];
    from: string;
    to: string;
  }): Promise<ChainResDto> {
    const signerPrivKey = newSignatureProvider({ privKey: privKey });
    const assetAry = [];

    for (const assetId of assetIds) {
      const stringToBuffer = Buffer.from(assetId);
      console.log('assetId: ', assetId);
      assetAry.push(stringToBuffer);
    }
    console.log('assetStringToBuffer: ', assetAry[0].toString('hex'));
    console.log('assetStringToBuffer: ', assetAry[1].toString('hex'));

    const payload: Operation = {
      name: 'batchTransfer',
      args: [
        assetAry,
        Buffer.from(pubKey, 'hex'),
        Buffer.from(from, 'hex'),
        Buffer.from(to, 'hex'),
      ],
    };
    return await this.chainOperation(payload, signerPrivKey);
  }

  async getHistoryByAssetId({ assetId }: { assetId: string }): Promise<any> {
    type ReturnType = { txIid: number; txHash: Buffer };
    const client = await this.restClient();
    const queryObject: QueryObject<ReturnType> = {
      name: 'getHistoryByAssetId',
      args: { assetId: Buffer.from(assetId) },
    };

    const res: any = await client
      .query(queryObject)
      .then((result) => {
        this.logger.log(`query result: ${JSON.stringify(result)}`);
        return result;
      })
      .catch((err) => {
        this.logger.log(`error: ${err}`);
        return err;
      });
    return res;
  }

  // async init() {
  //   const ary = [ 'AUO', 'auoInventoryTcon', 'auoBurnTcon', 'auoInventoryBLU', 'auoBurnBLU', 'auoInventoryFHDCell',
  //     'auoBurnFHDCell', 'auoInventoryQHDCell', 'auoBurnQHDCell', 'auoInventoryUHDCell', 'auoBurnUHDCell',
  //     'OTHER', 'otherOPInventoryTcon', 'otherOPBurnTcon', 'otherOPInventoryBLU',
  //     'otherOPBurnBLU', 'otherOPInventoryFHDCell', 'otherOPBurnFHDCell', 'otherOPInventoryQHDCell', 'otherOPBurnQHDCell',
  //     'otherOPInventoryUHDCell', 'otherOPBurnUHDCell',
  //     'CHANNEL', 'channelOPInventoryTcon', 'channelOPBurnTcon',
  //     'channelOPInventoryBLU', 'channelOPBurnBLU', 'channelOPInventoryFHDCell',
  //     'channelOPBurnFHDCell', "channelOPInventoryQHDCell", 'channelOPBurnQHDCell',
  //     'channelOPInventoryUHDCell', 'channelOPBurnUHDCell', 'WALLET'
  //   ];

  // const userDetailAry = [];
  // for (let user of ary) {

  // }
  // }
}
