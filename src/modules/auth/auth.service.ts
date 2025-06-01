import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async kakaoLogin(code: string) {
    // 1. 카카오로부터 액세스 토큰 받기
    const kakaoToken = await this.getKakaoToken(code);
    
    // 2. 액세스 토큰으로 카카오 사용자 정보 받기
    const userInfo = await this.getKakaoUserInfo(kakaoToken);
    
    // 3. 사용자 정보로 회원가입 또는 로그인 처리
    const user = await this.findOrCreateUser(userInfo);
    
    // 4. JWT 토큰 생성
    const payload = { 
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  private async getKakaoToken(code: string) {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.configService.get('KAKAO_CLIENT_ID'),
          client_secret: this.configService.get('KAKAO_CLIENT_SECRET'),
          redirect_uri: this.configService.get('KAKAO_REDIRECT_URI'),
          code,
        },
      });
      
      return response.data.access_token;
    } catch (error) {
      throw new UnauthorizedException('Failed to get Kakao token');
    }
  }

  private async getKakaoUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Failed to get Kakao user info');
    }
  }

  private async findOrCreateUser(kakaoUserInfo: any) {
    const email = kakaoUserInfo.kakao_account.email;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      // 새 사용자 생성
      user = await this.userService.create({
        email,
        name: kakaoUserInfo.properties.nickname,
        // 카카오 로그인의 경우 비밀번호는 불필요하지만, 
        // 엔티티에서 required라면 임의의 안전한 문자열을 설정
        password: `kakao_${Date.now()}`,
      });
    }

    return user;
  }
} 