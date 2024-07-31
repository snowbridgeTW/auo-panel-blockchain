import { Injectable } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    getHello(): string {
        return 'Hello World!';
    }
}
