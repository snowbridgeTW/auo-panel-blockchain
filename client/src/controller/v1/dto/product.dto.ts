import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class CreateProductDto extends KeyPairResDto {
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
