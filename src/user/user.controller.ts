import {
    Body,
    Controller,
    UseGuards,
    Get,
    Param,
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
import { jwtConstants } from 'src/auth/constants';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private authService: AuthService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    @Post('/create')
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        const user = await this.userService.register(createUserDto);

        if (!user) {
            res.send('error');
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            jwtConstants.secret,
            {
                expiresIn: '24hr',
            },
        );

        res.json({
            auth: token,
        });
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

        let profile = await this.userService.findByUserId(id);

        res.json({
            user: {
                username: profile.username,
                bio: profile.bio,
                links: profile.links,
                styles: {
                    bg_color: profile.bg_color,
                    username_color: profile.username_color,
                    text_color: profile.text_color,
                    bio_color: profile.bio_color,
                },
            },
        });
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
