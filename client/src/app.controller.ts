import { Controller, Get, Post } from '@nestjs/common';
// import { Controller, Get, Post } from '@nestjs/common/decorators';
import { AppService } from './app.service';
import { Logger } from '@nestjs/common/services';
import { ChainResDto, KeyPairDto, RegisterDto } from './app.interface';
import { Body } from '@nestjs/common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppService.name);

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('key/generate')
  async keyGen(): Promise<KeyPairDto> {
    try {
      const keyPair = await this.appService.generateECDSAKey();
      this.logger.debug(`keyPair: ${JSON.stringify(keyPair)}`);

      return keyPair;
    } catch (err) {
      this.logger.debug(`err: ${err}`);
      return err;
    };
  }

  @Post('account/register')
  async register(@Body() body: RegisterDto): Promise<ChainResDto> {
    this.logger.debug('call - api/register');
    let { privKey, pubKey, role } = body;
    /**
      auo, // mint asset、xfer asset、event log
        auoInventoryTcon, auoBurnTcon, auoInventoryBLU, auoBurnBLU, auoInventoryFHDCell, auoBurnFHDCell,
        auoInventoryQHDCell, auoBurnQHDCell, auoInventoryUHDCell, auoBurnUHDCell,
      obher, // xfer asset、event log
        oherOPInventoryTcon, oherOPBurnTcon, oherOPInventoryBLU, oherOPBurnBLU, oherOPInventoryFHDCell, oherOPBurnFHDCell,
        oherOPInventoryQHDCell, oherOPBurnQHDCell, oherOPInventoryUHDCell, oherOPBurnUHDCell,
      channel, // xfer asset、event log
        channelOPInventoryTcon, channelOPBurnTcon, channelOPInventoryBLU, channelOPBurnBLU, channelOPInventoryFHDCell, channelOPBurnFHDCell,
        channelOPInventoryQHDCell, channelOPBurnQHDCell, channelOPInventoryUHDCell, channelOPBurnUHDCell,
      wallet // event log
     */
    return await this.appService.register({
      privKey, pubKey, role
    });
  }

}
