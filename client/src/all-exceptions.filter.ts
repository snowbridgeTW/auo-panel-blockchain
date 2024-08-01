import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const url = request.url;

        Logger.error('----- all-exceptions.filter -----');
        Logger.error(url, 'url');
        Logger.error(exception, 'exception');

        let statusCode = 500;

        const retObj: any = {
            success: false,
            path: url,
            times: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            timestamp: dayjs().valueOf(),
        };

        statusCode = typeof exception.getStatus == 'function' ? exception.getStatus() : statusCode;

        if (statusCode == 400) {
            const getResponse: any = exception.getResponse();
            if (typeof getResponse == 'string') {
                const i = getResponse.split(' ');
                retObj.errorCode = parseInt(i[0]);
                retObj.message = i[1];
            }
            if (typeof getResponse == 'object') {
                retObj.message = getResponse.message[0];
            }
        } else {
            retObj.message = exception.toString();
        }

        Logger.error(statusCode, '狀態碼');
        Logger.error(JSON.stringify(retObj.message), '訊息');
        Logger.error(JSON.stringify(exception), '錯誤資料');
        Logger.error('---------------------------------');

        return response.status(statusCode).json(retObj);
    }
}
