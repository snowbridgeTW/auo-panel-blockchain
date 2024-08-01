import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddressesResDto {
    @ApiProperty({
        required: true,
        description: `The address ID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    addressId: string;

    @ApiProperty({
        required: true,
        description: `Description of the address`,
        example: 'Some description',
        type: String,
    })
    @IsString()
    desc: string;

    @ApiProperty({
        required: true,
        description: `Role associated with the address`,
        example: 'AUO_BROKEN_PART',
        type: String,
    })
    @IsString()
    role: string;

    @ApiProperty({
        required: true,
        description: `Creation time of the address record`,
        example: 1,
        type: Number,
    })
    @IsNumber()
    createdTime: number;
}

export class AddressReqDto {
    @ApiProperty({
        required: true,
        description: `The address ID, represented as a hexadecimal string`,
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
        type: String,
    })
    @IsString()
    pubkey: string;
}

export class AddressResDto {
    @ApiProperty({
        required: true,
        description: `Description of the address`,
        example: 'Some description',
        type: String,
    })
    @IsString()
    desc: string;

    @ApiProperty({
        required: true,
        description: `Role associated with the address`,
        example: 'AUO_BROKEN_PART',
        type: String,
    })
    @IsString()
    role: string;

    @ApiProperty({
        required: true,
        description: `Creation time of the address record`,
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
