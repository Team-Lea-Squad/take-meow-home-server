import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { CatModule } from './modules/cat/cat.module';
import { ShelterModule } from './modules/shelter/shelter.module';
import { typeOrmConfig } from './config/typeorm.config';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    UserModule,
    CatModule,
    ShelterModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('auth/(.*)')  // auth 관련 라우트는 제외
      .forRoutes('*');  // 나머지 모든 라우트에 적용
  }
}
