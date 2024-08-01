import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';

@Module({
    imports: [],
    controllers: [ChainController],
    providers: [ChainService],
    exports: [ChainService],
})
export class ChainModule_v1 {}
