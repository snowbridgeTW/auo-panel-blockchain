import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class KeyPairResDto {
    @ApiProperty({
        required: true,
        description: 'The private key of the generated ECDSA key pair',
        example: '16922db948ff945cb313690a5a6e89daca9861ac83eead17b628b417df98127c',
    })
    @IsString()
    privKey: string;

    @ApiProperty({
        required: true,
        description: 'The public key of the generated ECDSA key pair',
        example: '03a2f61668a1aee43262d1d0dcf083237a34d63f1fe5668d0f09bf1e77d0a78dbf',
    })
    pubKey: string;
}
