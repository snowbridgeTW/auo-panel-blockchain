import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
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
} from 'node_modules/postchain-client/built/src/blockchainClient/types';
import { ChainResDto } from '../dto/chain.dto';
import { KeyPairResDto } from '../dto/keypair.dto';
import { AddressResDto, AddressesResDto } from '../dto/address.dto';
import { AssetByAddressResDto, AssetByIdResDto } from '../dto/asset.dto';

@Injectable()
export class ChainService {
    private readonly logger = new Logger(ChainService.name);

    async restClient() {
        const nodeUrl: string[] = process.env.BLOCLCHAIN_API_URL.split(',');
        const client = await createClient({
            nodeUrlPool: nodeUrl,
            blockchainRid: process.env.BLOCKCHAIN_RID,
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

    async chainOperation(payload: Operation, signerPrivKey?: SignatureProvider): Promise<ChainResDto> {
        const client = await this.restClient();
        const currentDate = new Date();
        try {
            const receipt: TransactionReceipt = await client
                .signAndSendUniqueTransaction(payload, signerPrivKey)
                .on('sent', (receipt: TransactionReceipt) => {
                    this.logger.log(`sent tx: ${JSON.stringify(receipt)}`);
                });

            this.logger.log(`res: ${JSON.stringify(receipt)}`);
            this.logger.log(`transactionRid: ${receipt.transactionRid.toString('hex')}`);

            return {
                status: receipt.status,
                txId: receipt.transactionRid.toString('hex'),
                timestamp: currentDate.getTime(),
            };
        } catch (err: any) {
            this.logger.log(`res: ${JSON.stringify(err)}`);

            if (err.shortReason) {
                switch (err.shortReason) {
                    // 在这里可以添加其他特定的错误处理
                    default:
                        throw new HttpException(
                            {
                                status: process.env.RESPONSE_STATUS_REJECT,
                                message: err.shortReason,
                            },
                            HttpStatus.BAD_REQUEST,
                        );
                }
            } else {
                this.logger.error('err: ', err.message);
                const statusCodeMatch: string = err.message.match(/Contract: (\d+)/);
                let statusCode: number;

                if (statusCodeMatch && statusCodeMatch[1]) {
                    statusCode = parseInt(statusCodeMatch[1]);
                } else {
                    this.logger.error(`No status code found in message: ${err.message}`);
                    statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // 默认状态码
                }

                const messageMatch = err.message.match(/'text':\s*(.*?)(?=})/);
                this.logger.debug('messageMatch: ', messageMatch);

                const message =
                    messageMatch && messageMatch[1] ? messageMatch[1].trim() : 'An unexpected error occurred';

                throw new HttpException(
                    {
                        status: process.env.RESPONSE_STATUS_REJECT,
                        message: message,
                    },
                    statusCode,
                );
            }
        }
    }

    async generateECDSAKey(): Promise<KeyPairResDto> {
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
        description,
    }: {
        privKey: string;
        pubKey: string;
        role: number;
        description: string;
    }): Promise<ChainResDto> {
        const signerPrivKey = newSignatureProvider({ privKey: privKey });
        const payload: Operation = {
            name: 'register',
            args: [pubKey, role, description],
        };
        return await this.chainOperation(payload, signerPrivKey);
    }

    async getAddresses(): Promise<AddressesResDto[]> {
        type ReturnType = {
            addressId: string;
            desc: string;
            role: string;
            createdTime: number;
        };
        const client = await this.restClient();
        const queryObject: QueryObject<ReturnType> = {
            name: 'getAddresses',
            args: {},
        };
        const result: [AddressesResDto] = await client
            .query(queryObject)
            .then((result) => {
                this.logger.debug(`query result: ${JSON.stringify(result)}`);
                return result;
            })
            .catch((err) => {
                this.logger.debug(`error: ${err}`);
                return err;
            });

        const dataArray = Array.isArray(result) ? result : [result];
        const convertedData = dataArray.map((item) => {
            return {
                ...item,
                addressId: Buffer.isBuffer(item.addressId) ? item.addressId.toString('hex') : item.addressId,
            };
        });
        return convertedData;
    }

    async getAddress({ pubkey }: { pubkey: string }): Promise<AddressResDto> {
        type ReturnType = {
            desc: string;
            role: string;
            createdTime: number;
            blockHeight: number;
            blockRid: string;
            txRid: string;
        };
        const client = await this.restClient();
        const queryObject: QueryObject<ReturnType> = {
            name: 'getAddressMeta',
            args: { pubkey },
        };
        const result: AddressResDto = await client
            .query(queryObject)
            .then((result) => {
                this.logger.debug(`query result: ${JSON.stringify(result)}`);
                return result;
            })
            .catch((err) => {
                this.logger.debug(`error: ${err}`);
                return err;
            });

        result.blockRid = Buffer.isBuffer(result.blockRid) ? result.blockRid.toString('hex') : result.blockRid;
        result.txRid = Buffer.isBuffer(result.txRid) ? result.txRid.toString('hex') : result.txRid;

        return result;
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
            args: [name, Buffer.from(serialId, 'hex'), metaCID, Buffer.from(pubKey, 'hex')],
        };
        return await this.chainOperation(payload, signerPrivKey);
    }

    async batchMintAssets({
        privKey,
        pubKey,
        names,
        serialIds,
        metaCIDs,
    }: {
        privKey: string;
        pubKey: string;
        names: string[];
        serialIds: string[];
        metaCIDs: string[];
    }): Promise<ChainResDto> {
        const signerPrivKey = newSignatureProvider({ privKey: privKey });
        const payload: Operation = {
            name: 'mintAsset',
            args: [names, serialIds, metaCIDs, Buffer.from(pubKey, 'hex')],
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
            args: [Buffer.from(pubKey, 'hex'), Buffer.from(targetAddress, 'hex'), nftsMeta, message],
        };
        return await this.chainOperation(payload, signerPrivKey);
    }

    async transfer({
        privKey,
        pubKey,
        assetId,
        from,
        to,
    }: {
        privKey: string;
        pubKey: string;
        assetId: string;
        from: string;
        to: string;
    }): Promise<ChainResDto> {
        const signerPrivKey = newSignatureProvider({ privKey: privKey });
        const payload: Operation = {
            name: 'transferAsset',
            args: [assetId, Buffer.from(pubKey, 'hex'), Buffer.from(from, 'hex'), Buffer.from(to, 'hex')],
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
        assetIds: string[];
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
            args: [assetAry, Buffer.from(pubKey, 'hex'), Buffer.from(from, 'hex'), Buffer.from(to, 'hex')],
        };
        return await this.chainOperation(payload, signerPrivKey);
    }

    async getAssetByAddress({ address }: { address: string }): Promise<AssetByAddressResDto[]> {
        type ReturnType = [
            {
                id: string;
                name: string;
                issuer: string;
                metaData: string;
                owner: string;
            },
        ];
        this.logger.debug('query address: ', address);
        this.logger.debug('query Buffer address: ', Buffer.from(address, 'hex'));

        const client = await this.restClient();
        const queryObject: QueryObject<ReturnType> = {
            name: 'getAssetByAddress',
            args: { address: Buffer.from(address, 'hex') },
        };
        const res: AssetByAddressResDto[] = await client
            .query(queryObject)
            .then((result) => {
                this.logger.log(`query result: ${JSON.stringify(result)}`);
                return result;
            })
            .catch((err) => {
                const errorMessage = err.message.match(/Contract\[([^\]]+)\]/);
                if (errorMessage) {
                    const contractErrorContent = errorMessage[1];
                    this.logger.error(`Contract error content: ${contractErrorContent}`);
                    throw new HttpException(contractErrorContent, HttpStatus.NOT_FOUND);
                } else {
                    this.logger.error(`Unknown error occurred: ${err.message}`);
                    throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });

        const dataArray = Array.isArray(res) ? res : [res];
        const convertedData = dataArray.map((item) => {
            return {
                ...item,
                id: Buffer.isBuffer(item.id) ? item.id.toString('hex') : item.id,
                issuer: Buffer.isBuffer(item.issuer) ? item.issuer.toString('hex') : item.issuer,
                owner: Buffer.isBuffer(item.owner) ? item.owner.toString('hex') : item.owner,
            };
        });
        return convertedData;
    }

    async getAssetById({ assetId }: { assetId: string }): Promise<AssetByIdResDto> {
        type ReturnType = {
            id: string;
            name: string;
            issuer: string;
            metaData: string;
            owner: string;
            createdTime: number;
            blockHeight: number;
            blockRid: string;
            txRid: string;
        };

        this.logger.debug('query address: ', assetId);
        this.logger.debug('query Buffer address: ', Buffer.from(assetId));
        const client = await this.restClient();
        const queryObject: QueryObject<ReturnType> = {
            name: 'getAssetById',
            args: { assetId: Buffer.from(assetId) },
        };

        const res: AssetByIdResDto = await client
            .query(queryObject)
            .then((result) => {
                this.logger.log(`query result: ${JSON.stringify(result)}`);
                return result;
            })
            .catch((err) => {
                const errorMessage = err.message.match(/Contract\[([^\]]+)\]/);
                if (errorMessage) {
                    const contractErrorContent = errorMessage[1];
                    this.logger.error(`Contract error content: ${contractErrorContent}`);
                    throw new HttpException(contractErrorContent, HttpStatus.NOT_FOUND);
                } else {
                    this.logger.error(`Unknown error occurred: ${err.message}`);
                    throw new HttpException('Unknown error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        const convertedData = {
            ...res,
            id: Buffer.isBuffer(res.id) ? res.id.toString('hex') : res.id,
            issuer: Buffer.isBuffer(res.issuer) ? res.issuer.toString('hex') : res.issuer,
            owner: Buffer.isBuffer(res.owner) ? res.owner.toString('hex') : res.owner,
            blockRid: Buffer.isBuffer(res.blockRid) ? res.blockRid.toString('hex') : res.blockRid,
            txRid: Buffer.isBuffer(res.txRid) ? res.txRid.toString('hex') : res.txRid,
        };
        return convertedData;
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
}
