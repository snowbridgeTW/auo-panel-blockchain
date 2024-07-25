export class ChainResDto {
  status: string;
  txId: string;
  timestamp: number;
}

export class KeyPairDto {
  privKey: string;
  pubKey: string;
}

export class RegisterDto extends KeyPairDto {
  role: number;
}
