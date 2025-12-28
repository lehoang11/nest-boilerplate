import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { InternalAuthService } from './services/internal-auth.service'
import { UCenterService } from './services/ucenter.service'

@Module({
  imports: [HttpModule],
  providers: [
    InternalAuthService,
    UCenterService,
  ],
  exports: [
    InternalAuthService,
    UCenterService,
  ],
})
export class SharedModule {}
