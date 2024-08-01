import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { KeyPairResDto } from '../dto/keypair.dto';
import { RegisterReqDto } from '../dto/register.dto';
import { ChainResDto } from '../dto/chain.dto';
import {
    AssetByAddressDto,
    AssetByAddressResDto,
    AssetByIdDto,
    AssetByIdResDto,
    AssetMetaResDto,
    BatchMintAssetsDto,
    HistoryResDto,
    MintAssetDto,
} from '../dto/asset.dto';
import {
    ProductByAddressReqDto,
    ProductDetailResDto,
    ProductHistoryResDto,
    ProductReqDto,
    TrashedProductReqDto,
} from '../dto/product.dto';
import { BatchTransferDto, TransferDto } from '../dto/transfer.dto';
import { HistoryByAddressIdDto, HistoryByAssetIdDto } from '../dto/history.dto';
import { AddressReqDto, AddressResDto, AddressesResDto } from '../dto/address.dto';

@Controller('v1/chain')
export class ChainController {
    constructor(private readonly chainService: ChainService) {}
    private readonly logger = new Logger(ChainService.name);

    @ApiTags('Key')
    @Post('key/generate')
    @ApiOperation({
        summary: 'Generate ECDSA Key Pair',
        description: 'Generates an ECDSA key pair and returns the private key and public key.',
    })
    @ApiResponse({
        status: 201,
        type: KeyPairResDto,
    })
    async keyGen(): Promise<KeyPairResDto> {
        this.logger.debug(`Call - api/v1/key/generate`);
        try {
            const keyPair = await this.chainService.generateECDSAKey();
            this.logger.debug(`keyPair: ${JSON.stringify(keyPair)}`);

            return keyPair;
        } catch (err) {
            this.logger.debug(`err: ${err}`);
            return err;
        }
    }

    @ApiTags('Address')
    @Post('address/register')
    @ApiOperation({
        summary: 'Register a new wallet address',
        description: `Registers a new wallet address using the provided private key, public key, and role. 
      </br>Currently, the wallet is managed by the backend system, and the public key is used as the address ID. 
      </br>This approach is preliminary and subject to change.`,
    })
    @ApiResponse({
        status: 201,
        type: ChainResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async register(@Body() body: RegisterReqDto): Promise<ChainResDto> {
        this.logger.debug(`Call - api/v1/address/register`);
        const { privKey, pubKey, role, description } = body;

        try {
            return await this.chainService.register({
                privKey,
                pubKey,
                role,
                description,
            });
        } catch (error) {
            this.logger.error(`Error registering address: ${error.message}`);
            throw new HttpException(
                {
                    status: process.env.RESPONSE_STATUS_FAILED,
                    message: 'Unable to register address.',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @ApiTags('Address')
    @Get('address/list')
    @ApiOperation({
        summary: 'Get list of addresses',
        description:
            'Retrieves a list of addresses with their metadata including addressId, description, role, and creation time.',
    })
    @ApiResponse({
        status: 200,
        description: 'A list of address metadata.',
        type: [AddressesResDto],
    })
    async getAddresses(): Promise<AddressesResDto[]> {
        this.logger.debug(`Call - api/v1/address/list`);
        return await this.chainService.getAddresses();
    }

    @ApiTags('Address')
    @Get('address')
    @ApiOperation({
        summary: 'Get address metadata',
        description: 'Fetches metadata for a given address based on the provided public key.',
    })
    @ApiResponse({
        status: 200,
        description: 'The metadata of the address.',
        type: AddressResDto,
    })
    async getAddressMeta(@Query() request: AddressReqDto): Promise<AddressResDto> {
        this.logger.debug(`Call - api/v1/address`);
        return await this.chainService.getAddress({ pubkey: request.pubkey });
    }

    @ApiTags('Asset')
    @Post('asset/mint')
    @ApiOperation({
        summary: 'Mint a new asset',
        description: 'Mints a new asset on the blockchain with the provided details.',
    })
    @ApiResponse({
        status: 201,
        description: 'The asset has been successfully minted.',
        type: ChainResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async mintAsset(@Body() body: MintAssetDto): Promise<ChainResDto> {
        this.logger.debug('Call - api/v1/asset/mint');
        const { privKey, pubKey, name, serialId, metaCID } = body;

        return await this.chainService.mintAsset({
            privKey,
            pubKey,
            name,
            serialId,
            metaCID,
        });
    }

    @ApiTags('Asset')
    @Post('asset/batch-mint')
    @ApiOperation({
        summary: 'Batch mint NFT assets',
        description: 'Mints multiple NFT assets in a batch using the provided names, serial IDs, and metaCIDs.',
    })
    @ApiResponse({
        status: 201,
        description: 'The NFT assets have been successfully minted.',
        type: ChainResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async batchMintAssets(@Body() body: BatchMintAssetsDto): Promise<ChainResDto> {
        this.logger.debug('Call - api/v1/asset/batch-mint');
        const { privKey, pubKey, names, serialIds, metaCIDs } = body;

        return await this.chainService.batchMintAssets({
            privKey,
            pubKey,
            names,
            serialIds,
            metaCIDs,
        });
    }

    @ApiTags('Asset')
    @Post('asset/transfer')
    @ApiOperation({
        summary: 'Transfer a single NFT asset',
        description: 'Transfers a single NFT asset from one address to another.',
    })
    @ApiResponse({
        status: 201,
        description: 'The NFT asset has been successfully transferred.',
        type: ChainResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async transfer(@Body() body: TransferDto): Promise<ChainResDto> {
        this.logger.debug('Call - api/v1/asset/transfer');
        const { privKey, pubKey, assetId, from, to } = body;
        return await this.chainService.transfer({
            privKey,
            pubKey,
            assetId,
            from,
            to,
        });
    }

    @ApiTags('Asset')
    @Post('asset/batch-transfer')
    @ApiOperation({
        summary: 'Batch transfer NFT assets',
        description: 'Transfers multiple NFT assets in a batch from one address to another.',
    })
    @ApiResponse({
        status: 201,
        description: 'The NFT assets have been successfully transferred.',
        type: ChainResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid input data.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async batchTransfer(@Body() body: BatchTransferDto): Promise<ChainResDto> {
        this.logger.debug('call - api/v1/asset/batch-transfer');
        const { privKey, pubKey, assetIds, from, to } = body;
        return await this.chainService.batchTransfer({
            privKey,
            pubKey,
            assetIds,
            from,
            to,
        });
    }

    @ApiTags('Asset')
    @Get('asset/:address')
    @ApiOperation({
        summary: 'Get assets by address',
        description: 'Retrieves all assets associated with a specific address.',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved assets.',
        type: [AssetByAddressResDto],
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid address format.',
    })
    @ApiResponse({
        status: 404,
        description: 'Address not found',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async getAssetByAddress(@Param() params: AssetByAddressDto): Promise<AssetByAddressResDto[]> {
        this.logger.debug('call - api/v1/asset/:address');
        const { address } = params;
        return await this.chainService.getAssetByAddress({
            address,
        });
    }

    @ApiTags('Asset')
    @Get('asset/:assetId')
    @ApiOperation({
        summary: 'Get asset by ID',
        description: 'Retrieves details of an asset by its ID.',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved asset details.',
        type: AssetByIdResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid asset ID format.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async getAssetById(@Param() params: AssetByIdDto): Promise<AssetByIdResDto> {
        this.logger.debug('call - api/v1/asset/:assetId');
        const { assetId } = params;
        return await this.chainService.getAssetById({
            assetId,
        });
    }

    @ApiTags('Asset')
    @Get('asset/:assetId/meta')
    @ApiOperation({
        summary: 'Get asset by ID',
        description: 'Retrieves details of an asset by its ID.',
    })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved asset metadata.',
        type: AssetMetaResDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid asset ID format.',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async getAssetMeta(@Param() params: AssetByIdDto): Promise<AssetMetaResDto> {
        this.logger.debug('call - api/v1/asset/:assetId/meta');
        const { assetId } = params;
        return await this.chainService.getAssetMeta({
            assetId,
        });
    }

    @Get('asset/:address/history')
    async getHistoryByAddressId(@Param() params: HistoryByAddressIdDto): Promise<HistoryResDto[]> {
        this.logger.debug('call - api/v1/asset/:address/history');
        const { address } = params;
        return await this.chainService.getHistoryByAddress({
            address,
        });
    }

    @Get('asset/:assetId/history')
    async getHistoryByAssetId(@Param() params: HistoryByAssetIdDto): Promise<HistoryResDto[]> {
        this.logger.debug('call - api/v1/asset/:assetId/history');
        const { assetId } = params;
        return await this.chainService.getHistoryByAssetId({
            assetId,
        });
    }

    @ApiTags('Product')
    @Post('product/create')
    async createProduct(@Body() body: ProductReqDto): Promise<ChainResDto> {
        this.logger.debug('call - api/v1/product/create');
        const { privKey, pubKey, targetAddress, nftsMeta, message } = body;
        return await this.chainService.productOperaction({
            privKey,
            pubKey,
            targetAddress,
            nftsMeta,
            message,
            operationName: 'createProduct',
        });
    }

    @ApiTags('Product')
    @Post('product/update-meta')
    async updateProductMeta(@Body() body: ProductReqDto): Promise<ChainResDto> {
        this.logger.debug('call - api/v1/product/create');
        const { privKey, pubKey, targetAddress, nftsMeta, message } = body;
        return await this.chainService.productOperaction({
            privKey,
            pubKey,
            targetAddress,
            nftsMeta,
            message,
            operationName: 'updateProductMeta',
        });
    }

    @ApiTags('Product')
    @Post('product/trashed')
    async trashedProduct(@Body() body: TrashedProductReqDto): Promise<ChainResDto> {
        this.logger.debug('call - api/v1/product/trashed');
        const { privKey, pubKey, owner, message } = body;
        return await this.chainService.trashedProduct({
            privKey,
            pubKey,
            owner,
            message,
        });
    }

    @Get('product/:address/detail')
    async getProductDetail(@Param() params: ProductByAddressReqDto): Promise<ProductDetailResDto> {
        this.logger.debug('call - api/v1/asset/:assetId/detail');
        const { address } = params;
        return await this.chainService.getProductDetail({
            address,
        });
    }

    @Get('product/:address/history')
    async getProductHistory(@Param() params: ProductByAddressReqDto): Promise<ProductHistoryResDto[]> {
        this.logger.debug('call - api/v1/asset/:assetId/history');
        const { address } = params;
        return await this.chainService.getProductHistory({
            address,
        });
    }
}
