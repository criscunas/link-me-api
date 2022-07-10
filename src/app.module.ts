import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LinkModule } from './links/link.module';
import { StylingModule } from './styling/styling.module';
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
      ConfigModule.forRoot(), 
      MongooseModule.forRoot(process.env.DB_URI),
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'client'),
      }),
      UserModule,
      LinkModule,
      AuthModule,
      StylingModule,
    ],
})
export class AppModule {}
