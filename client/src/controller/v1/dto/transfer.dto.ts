import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class TransferDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: '',
        example: 'J15916B0901646I000377A1108704',
    })
    @IsString()
    assetId: string;

    @ApiProperty({
        required: true,
        description: 'The wallet ID from which the NFTs are being transferred',
        example: '02c399533a3733336cdaffffd1793452cc0a730950b52a38cb0a0900f9a11563fc',
    })
    @IsString()
    from: string;

    @ApiProperty({
        required: true,
        description: 'The wallet ID to which the NFTs are being transferred',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
    })
    @IsString()
    to: string;
}

export class BatchTransferDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The list of asset IDs to be transferred',
        example: ['J15916B0901646I000377A1108704', 'J15916B0901646I000377A1108705'],
    })
    @IsArray()
    @IsString({ each: true })
    assetIds: string[];

    @ApiProperty({
        required: true,
        description: 'The wallet ID from which the NFTs are being transferred',
        example: '02c399533a3733336cdaffffd1793452cc0a730950b52a38cb0a0900f9a11563fc',
    })
    @IsString()
    from: string;

    @ApiProperty({
        required: true,
        description: 'The wallet ID to which the NFTs are being transferred',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
    })
    @IsString()
    to: string;
}
