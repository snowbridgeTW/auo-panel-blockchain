import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class HistoryByAssetIdDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The asset ID for which to retrieve the history records',
        example: 'J15916B0901646I000377A1108704',
    })
    @IsString()
    assetId: string;
}
