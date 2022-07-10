import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model <UserDocument>,
  ) {}

  async register(username: string, password:string) : Promise<any> {

    const hash = await bcrypt.hash(password, 10);

    const obj = {
      username: username,
      password: hash,
      bio: '',
      _id: uuidv4(),
      bio_color: "#000000",
      text_color: "#000000",
      username_color: "#000000",
      bg_color: "#ffffff"
    };

    return obj
  }

  async findUser(username: string): Promise<User> {
    return this.userModel.findOne({username:username})
  }

  async findByUserId(id: string): Promise <User> {
    return this.userModel.findById(id)
  }
}