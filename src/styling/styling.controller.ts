import {
  Body,
  Controller,
  UseGuards,
  Res,
  Post,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { AddStyleDTO } from './dto/add-style-dto';

@Controller('style')
export class ProfileController {
  constructor(
      @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/background')
      bgColor(@Res() res: Response, @Request() req, @Body() addStyleDto : AddStyleDTO) {
        this.userModel.findOneAndUpdate(
          {_id: req.user.id},
          { $set: {bg_color : addStyleDto.bg_color}}, 
          {returnDocument: "after"}
        )
        .then((data) => {
          res.json({
            bg_color : data.bg_color
          })
        })
        .catch((error) => {
          res.json({
            error:  error
          })
        })
    }

  @UseGuards(JwtAuthGuard)
  @Post('/username')
      usernameColor(@Res() res: Response, @Request() req, @Body() addStyleDto: AddStyleDTO) {
        this.userModel.findOneAndUpdate(
          {_id: req.user.id},
          { $set: {username_color : addStyleDto.username_color}}, 
          {returnDocument: "after"}
        )
        .then((data) => {
          res.json({
            username_color: data.username_color
          })
        })
        .catch((error) => {
          res.json({
            error:  error
          })
        })
    }

  @UseGuards(JwtAuthGuard)
  @Post('/text')
      textColor(@Res() res: Response, @Request() req, @Body() addStyleDto : AddStyleDTO) {
        this.userModel.findOneAndUpdate(
          {_id: req.user.id},
          { $set: {text_color : addStyleDto.text_color}}, 
          {returnDocument: "after"}
        )
        .then((data) => {
          res.json({
            text_color: data.text_color
          })
        })
        .catch((error) => {
          res.json({
            error:  error
          })
        })
    }
  
  @UseGuards(JwtAuthGuard)
  @Post('/biography')
    bioColor(@Res() res: Response, @Request() req, @Body() addStyleDto : AddStyleDTO) {
      this.userModel.findOneAndUpdate(
        {_id: req.user.id},
        { $set: {bio_color : addStyleDto.bio_color}}, 
        {returnDocument: "after"}
      )
      .then((data) => {
        res.json({
          bio_color: data.bio_color
        })
      })
      .catch((error) => {
      res.json({
        error:  error
      })
    })
  }

  
}

