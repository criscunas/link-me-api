import {
    Body,
    Controller,
    UseGuards,
    Get,
    Res,
    Post,
    HttpStatus,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateBioDto } from './dto/create-bio.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.services';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    @Post('/create')
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        
        const user = await this.userService.register(createUserDto.username, createUserDto.password);
        const jwts = process.env.JWTS
        
        this.userModel.create(user)
          .then((data) => {

          const token = jwt.sign(
            {
                id: data._id,
            },
              jwts,
            {
                expiresIn: '24hr',
            },
        );
          res.json({
            auth: token
          })
        }).catch((error) => {
          console.log(error)
        })


    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/get')
    async getProfile(@Request() req, @Res() res: Response) {
        const id = req.user.id;

        this.userModel.findById(id).then((user) => {
          res.json({
            user : {
              username: user.username,
              bio: user.bio, 
              links : user.links,
              styles: {
                bg_color: user.bg_color,
                bio_color: user.bio_color,
                text_color: user.text_color,
                username_color: user.username_color
              }
            }
          })
          console.log(user)
        }).catch((error) =>{ 
          console.log(error)
        })
        

    }

    @UseGuards(JwtAuthGuard)
    @Post('/bio')
    async postBio(@Request() req, @Body() createBioDto: CreateBioDto, @Res() res: Response) {
        const id = req.user.id;

        this.userModel
            .updateOne({ _id: id }, { $set: { bio: createBioDto.bio } })
            .then(() => {
                res.status(HttpStatus.CREATED).json({
                    bio: createBioDto.bio,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
