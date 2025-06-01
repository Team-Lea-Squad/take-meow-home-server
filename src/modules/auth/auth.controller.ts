import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @Redirect()
  async kakaoAuth() {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${this.configService.get('KAKAO_CLIENT_ID')}&redirect_uri=${this.configService.get('KAKAO_REDIRECT_URI')}&response_type=code`;
    return { url: kakaoAuthURL };
  }

  @Get('kakao/callback')
  async kakaoCallback(@Query('code') code: string) {
    return this.authService.kakaoLogin(code);
  }
} 