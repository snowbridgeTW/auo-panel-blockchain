import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class ProductReqDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The wallet ID of the product',
        example: '0228c9c672757275923be466224694a4c5ed5c3ca1a9a1a07d3a4670d9fcfb1286',
    })
    @IsString()
    targetAddress: string;

    @ApiProperty({
        required: true,
        description:
            'The location of the NFT metadata file that describes the collection of NFTs for the product. This is stored on IPFS.',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXGG',
    })
    @IsString()
    nftsMeta: string;

    @ApiProperty({
        required: true,
        description: 'The name of the product',
        example: 'AUO-TFT-LCD',
    })
    @IsString()
    message: string;
}

export class TrashedProductReqDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The wallet ID of the product',
        example: '0228c9c672757275923be466224694a4c5ed5c3ca1a9a1a07d3a4670d9fcfb1286',
    })
    @IsString()
    owner: string;

    @ApiProperty({
        required: true,
        description: 'The name of the product',
        example: 'AUO-TFT-LCD',
    })
    @IsString()
    message: string;
}

export class ProductByAddressReqDto {
    @ApiProperty({
        required: true,
        description: 'The wallet ID of the product',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
    })
    @IsString()
    address: string;
}

export class ProductDetailResDto {
    @ApiProperty({
        required: true,
        description: 'The name of the product',
        example: 'AUO-TFT-LCD',
    })
    @IsString()
    name: string;

    @ApiProperty({
        required: true,
        description: 'Metadata of the product stored on IPFS',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
    })
    @IsString()
    metaData: string;

    @ApiProperty({
        required: true,
        description: 'The timestamp when the product was created',
        example: 1617184800000,
    })
    @IsNumber()
    createdTime: number;
}

export class ProductHistoryResDto {
    @ApiProperty({
        required: true,
        description: 'The event ID related to the product',
        example: '91cb23932c57f7abcd30f79b01657d1f733099555727872d950ebd6736eb70dd',
    })
    @IsString()
    eventId: string;

    @ApiProperty({
        required: true,
        description: 'Metadata of the event stored on IPFS',
        example: 'http://localhost:3000/ipfs/QmYM7aCt6muCWcWJE2HemyZXpC4itiGg6Jxwwj1EprUXXA',
    })
    @IsString()
    metaData: string;

    @ApiProperty({
        required: true,
        description: 'Additional notes about the event',
        example: 'Product transferred to new owner',
    })
    @IsString()
    note: string;

    @ApiProperty({
        required: true,
        description: 'The action performed (e.g., transfer, mint)',
        example: 'transfer',
    })
    @IsString()
    action: string;

    @ApiProperty({
        required: true,
        description: 'The operator who performed the action',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
    })
    @IsString()
    operator: string;

    @ApiProperty({
        required: true,
        description: 'The timestamp when the action was performed',
        example: 1617184800000,
    })
    @IsNumber()
    createdTime: number;

    @ApiProperty({
        required: true,
        description: 'The block height at which the action was recorded',
        example: 1,
    })
    @IsNumber()
    blockHeight: number;

    @ApiProperty({
        required: true,
        description: 'The block RID at which the action was recorded',
        example: '4e7ebf7bde52f325f25400529524c9e0b30872258db686e59188348abacb7a0a',
    })
    @IsString()
    blockRid: string;
}
