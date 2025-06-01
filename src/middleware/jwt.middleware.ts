import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const token = authHeader.split(' ')[1]; // Bearer token 형식에서 token 부분만 추출
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });
      
      // req.user에 디코딩된 payload 저장
      req['user'] = payload;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 