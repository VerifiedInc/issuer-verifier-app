import { Body, Controller, HttpCode, Post, Response, Request, UseGuards } from '@nestjs/common';
import { Response as Res, Request as Req } from 'express';
import { IssuerService } from './issuer.service';
import { AuthGuard } from '../../guards/auth.guard';
import { VersionGuard } from '../../guards/version.guard';
import { IssuerV2Service } from '../../issuer-v2/issuer-v2.service';
import { lt } from 'semver';

@UseGuards(VersionGuard)
@Controller('issuer/api')
export class IssuerController {
  constructor (private issuerService: IssuerService, private issuerV2Service: IssuerV2Service) {}

  // todo and real types to these requests
  @Post('register')
  //   @Header('x-auth-token')
  async register (@Request() req: Req, @Body() dto: any, @Response() res: Res) {
    try {
      let result;
      if (lt(req.headers.version as string, '2.0.0')) {
        result = await this.issuerService.registerIssuer(dto.name, dto.customerUuid, dto.apiKey);
      } else {
        result = await this.issuerV2Service.registerIssuer(dto.name, dto.customerUuid, dto.apiKey);
      }

      // todo figure out the more elegant NestJS way of doing this.
      return res.set({ 'x-auth-token': result.authToken }).json(result.body);
    } catch (error) {
      res.status(400);
      return res.json(error);
    }
  }

  @Post('issueCredential')
  @UseGuards(AuthGuard)
  async issueCredential (@Request() req: Req, @Body() dto: any, @Response() res: Res) {
    try {
      const auth = req.headers.authorization;

      let result;
      if (lt(req.headers.version as string, '2.0.0')) {
        result = await this.issuerService.issueCredential(auth, dto.type, dto.issuer, dto.credentialSubject, dto.eccPrivateKey, dto.expirationDate);
      } else {
        result = await this.issuerV2Service.issueCredential(auth, dto.type, dto.issuer, dto.credentialSubject, dto.eccPrivateKey, dto.expirationDate);
      }

      return res.set({ 'x-auth-token': result.authToken }).json(result.body);
    } catch (error) {
      res.status(400);
      return res.json(error);
    }
  }

  @Post('updateCredentialStatus')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async revokeCredential (@Request() req: Req, @Body() dto: any, @Response() res: Res) {
    try {
      const auth = req.headers.authorization;

      let result;
      if (lt(req.headers.version as string, '2.0.0')) {
        result = await this.issuerService.updateCredentialStatus(auth, dto.credentialId, dto.status);
      } else {
        result = await this.issuerV2Service.updateCredentialStatus(auth, dto.credentialId, dto.status);
      }

      return res.set({ 'x-auth-token': result.authToken }).json(result.body);
    } catch (error) {
      res.status(400);
      return res.json(error);
    }
  }
}
