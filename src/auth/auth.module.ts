import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.services";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { UserModule } from "src/user/user.module";
import { LinkModule } from "src/links/link.module";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports:[
    forwardRef(() => UserModule),
    forwardRef(() => LinkModule),
    PassportModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions: {expiresIn: "24hr"}
    }),
  ],
  providers:[AuthService, LocalStrategy, JwtStrategy],
  exports:[AuthService],
})

export class AuthModule {}