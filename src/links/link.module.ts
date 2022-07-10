import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import { LinkController } from "./link.controller";
import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from '../user/schemas/user.schema';
import { LinkService } from "./link.service";

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ], 
  controllers: [LinkController],
  providers:[LinkService],
  exports: []
})

export class LinkModule {}