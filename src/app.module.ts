import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CredentialsController } from './credentials/credentials.controller';
import { CredentialsService } from './credentials/credentials.service';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [CredentialsModule],
})
export class AppModule {}
