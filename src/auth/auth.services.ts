import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService  
  ) {}


  async validateUser(username: string, password: string): Promise<any> {
    
    const user = await this.userService.findUser(username)

    const isMatch = await bcrypt.compare(password, user.password)
  
    if(isMatch) {
      return user
    }
    return null
  }

  async login(user:any) {
    const payload = {id: user._id}
    return {
      auth: this.jwtService.sign(payload)
    }
  }

}