import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TeleService } from './tele.service';


@Global()
@Module({
  imports: [ConfigModule],
  providers: [TeleService],
  exports: [TeleService],
})
export class TeleModule {}
