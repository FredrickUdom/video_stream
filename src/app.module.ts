import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrm } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrm,
    }),
    UserModule,
    VideoModule,
    CommentModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
