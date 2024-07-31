import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class ChainResDto {
    @ApiProperty({
        required: true,
        description: 'comfirm or reject or wait',
        example: 'comfirm',
    })
    @IsString()
    status: string;

    @ApiProperty({
        required: true,
        description: 'Transaction RID',
        example: 'be66e8a753b193ead8834912f1dbe1b555e390e5b5d65816a5f6164c08fd3aab',
    })
    @IsString()
    txId: string;

    @ApiProperty({
        required: true,
        description: '',
        example: 1704625543000,
    })
    @IsNumber()
    timestamp: number;
}
