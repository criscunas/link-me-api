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

  async register(createUserDto: CreateUserDto) : Promise<User> {

    const hash = await bcrypt.hash(createUserDto.password, 10);

    const obj = {
      username: createUserDto.username,
      password: hash,
      _id: uuidv4(),
    };


    const user = await this.userModel.create(obj)
    return user
  }

  async findUser(username: string): Promise<User> {
    return this.userModel.findOne({username:username})
  }

  async findByUserId(id: string): Promise <User> {
    return this.userModel.findById(id)
  }
}