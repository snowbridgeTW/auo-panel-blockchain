import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class MintAssetDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The name of the NFT asset',
        example: 'T-con board',
        type: String,
    })
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        description: 'The unique identifier for the component',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    serialId: string;

    @ApiProperty({
        required: true,
        description:
            'The metadata CID (Content Identifier) that describes the NFT content. It is stored on IPFS and provides a CID path.',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
        type: String,
    })
    @IsString()
    metaCID: string;
}

export class BatchMintAssetsDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The names of the NFT assets',
        example: ['T-con board'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    names: string[];

    @ApiProperty({
        required: true,
        description: 'The serial IDs of the NFT assets',
        example: ['J15916B0901646I000377A1108704'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    serialIds: string[];

    @ApiProperty({
        required: true,
        description: 'The metaCID URLs of the NFT assets stored on IPFS',
        example: ['http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA'],
        type: String,
    })
    @IsArray()
    @IsString({ each: true })
    metaCIDs: string[];
}

export class AssetByAddressDto {
    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    address: string;
}

export class AssetByAddressResDto {
    @ApiProperty({
        required: true,
        description: 'The unique identifier for the component',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    id: string;

    @ApiProperty({
        required: true,
        description: 'The name of the NFT asset',
        example: 'T-con board',
        type: String,
    })
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    issuer: string;

    @ApiProperty({
        required: true,
        description:
            'The metadata CID (Content Identifier) that describes the NFT content. It is stored on IPFS and provides a CID path.',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
        type: String,
    })
    @IsString()
    metaData: string;

    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    owner: string;
}

export class AssetByIdDto {
    @ApiProperty({
        required: true,
        description: 'The serial IDs of the NFT assets',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    assetId: string;
}

export class AssetByIdResDto {
    @ApiProperty({
        required: true,
        description: 'The unique identifier for the component',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    id: string;

    @ApiProperty({
        required: true,
        description: 'The name of the NFT asset',
        example: 'T-con board',
        type: String,
    })
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    issuer: string;

    @ApiProperty({
        required: true,
        description:
            'The metadata CID (Content Identifier) that describes the NFT content. It is stored on IPFS and provides a CID path.',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
        type: String,
    })
    @IsString()
    metaData: string;

    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    owner: string;

    @ApiProperty({
        required: true,
        description: `Creation time of the asset record`,
        example: 1722321265493,
        type: Number,
    })
    @IsNumber()
    createdTime: number;

    @ApiProperty({
        required: true,
        description: `The block height`,
        example: 1,
        type: Number,
    })
    @IsNumber()
    blockHeight: number;

    @ApiProperty({
        required: true,
        description: `The block RID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    blockRid: string;

    @ApiProperty({
        required: true,
        description: `The transaction RID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    txRid: string;
}

export class AssetMetaResDto {
    @ApiProperty({
        required: true,
        description:
            'The metadata CID (Content Identifier) that describes the NFT content. It is stored on IPFS and provides a CID path.',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
        type: String,
    })
    @IsString()
    metaData: string;
}

export class HistoryResDto {
    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    owner: string;

    @ApiProperty({
        required: true,
        description: 'The serial IDs of the NFT assets',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    asset: string;

    @ApiProperty({
        required: true,
        description: 'The address ID, represented as a hexadecimal string',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    to: string;

    @ApiProperty({
        required: true,
        description: 'The action performed on the asset (e.g., transfer, mint)',
        example: 'transfer',
        type: String,
    })
    @IsString()
    action: string;

    @ApiProperty({
        required: true,
        description: 'The time the action was performed, represented as a timestamp',
        example: 1617184800000,
        type: Number,
    })
    @IsNumber()
    createdTime: number;

    @ApiProperty({
        required: true,
        description: 'The block height at which the action was recorded',
        example: 12345,
        type: Number,
    })
    @IsNumber()
    blockHeight: number;

    @ApiProperty({
        required: true,
        description: 'The block RID at which the action was recorded',
        example: 'abcd1234',
        type: String,
    })
    @IsString()
    blockRid: string;

    @ApiProperty({
        required: true,
        description: `The transaction RID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    txRid: string;
}
