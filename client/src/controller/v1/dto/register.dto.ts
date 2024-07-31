import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { KeyPairResDto } from './keypair.dto';

export class RegisterReqDto extends KeyPairResDto {
    @ApiProperty({
        required: true,
        description: `Role of the wallet:
          </br>0: AUO;
          </br>1: AUO_BROKEN_PART;
          </br>2: AUO_Inventory;
          </br>3: OTHER;
          </br>4: CHANNEL;
          </br>5: WALLET`,
        example: 1,
    })
    @IsNumber()
    role: number;

    @ApiProperty({
        required: true,
        description: `Description of the wallet asset, e.g., auoBurnTcon.`,
        example: 'auoBurnTcon',
        type: String,
    })
    @IsString()
    description: string;
}
