import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common/services';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    private readonly logger = new Logger(AppService.name);

    // @Get()
    // getHello(): string {
    //     return this.appService.getHello()
    // }
}
