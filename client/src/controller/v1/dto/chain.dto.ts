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
        example: '1cd718b59381ae8c302d1d6f62c8a1b434fcbbdbe44eb25ba2a05a18dca4dd36',
    })
    @IsString()
    txRid: string;

    @ApiProperty({
        required: true,
        description: '',
        example: 1704625543000,
    })
    @IsNumber()
    timestamp: number;
}
