import { Module } from '@nestjs/common';
import { ChainModule_v1 } from './chain/chain.module';

@Module({
    imports: [ChainModule_v1],
})
export class ControllerModule_v1 {}
