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

export class MintAssetDto extends KeyPairDto {
  privKey: string;
  pubKey: string;
  name: string;
  serialId: string;
  metaCID: string;
}

export class CreateProductDto extends KeyPairDto {
  privKey: string;
  pubKey: string;
  targetAddress: string;
  nftsMeta: string;
  message: string;
}

export class BatchTransferDto extends KeyPairDto {
  privKey: string;
  pubKey: string;
  assetIds: [string];
  from: string;
  to: string;
}

export class HistoryByAssetIdDto extends KeyPairDto {
  assetId: string;
}
