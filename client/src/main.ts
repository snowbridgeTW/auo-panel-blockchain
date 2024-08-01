import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    Logger.log(`SERVER_NAME: ${process.env.SERVER_NAME}`);
    Logger.log(`SERVER_PORT: ${process.env.SERVER_PORT}`);

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.setGlobalPrefix('api');

    const host = process.env.SERVER_HOST;
    const port = process.env.SERVER_PORT;
    const apiURL =
        process.env.SERVER_PROTOCOL === 'http'
            ? `http://${host}:${port}`
            : `https://${process.env.SERVER_PUBLIC_DOMAIN}`;

    const options = new DocumentBuilder()
        .setTitle(`NFT system for circular economy of WEEE API`)
        .setDescription(
            `The purpose of this application is to mint and transfer NFTs which link to recyclable components of Electrical and Electronic Equipment (EEE). </br>Each NFT contains a component’s metadata. By tracking the NFTs (and its metadata) transferred between the wallets owned by different entities.`,
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(apiURL)
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('apidoc', app, document);

    await app.listen(process.env.SERVER_PORT);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
