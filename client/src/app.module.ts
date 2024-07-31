// import { Module } from '@nestjs/common';
import { Module } from '@nestjs/common/decorators';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerModule_v1 } from './controller/v1/v1.module';

@Module({
    imports: [ControllerModule_v1],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
