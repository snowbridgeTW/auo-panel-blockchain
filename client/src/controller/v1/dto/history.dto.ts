import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HistoryByAddressIdDto {
    @ApiProperty({
        required: true,
        description: `The address ID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    address: string;
}

export class HistoryByAssetIdDto {
    @ApiProperty({
        required: true,
        description: 'The asset ID for which to retrieve the history records',
        example: 'J15916B0901646I000377A1108704',
        type: String,
    })
    @IsString()
    assetId: string;
}
