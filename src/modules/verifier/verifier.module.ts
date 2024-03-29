import { Module } from '@nestjs/common';
import { VerifierService } from './verifier.service';
import { VerifierController } from './verifier.controller';
import { VerifierV2Service } from 'src/modules/verifier/verifier-v2/verifier-v2.service';
import { VerifierV3Service } from 'src/modules/verifier/verifier-v3/verifier-v3.service';
import { VerifierV4Service } from './verifier-v4/verifier-v4.service';

@Module({
  providers: [VerifierService, VerifierV2Service, VerifierV3Service, VerifierV4Service],
  controllers: [VerifierController]
})
export class VerifierModule {}
