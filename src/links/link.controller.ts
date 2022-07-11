import {
    Body,
    Controller,
    UseGuards,
    Delete,
    Param,
    Res,
    Post,
    Request,
    Put,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateLinkDto } from './dto/create-link-dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LinkService } from './link.service';

@Controller('links')
export class LinkController {
    constructor(
        private readonly linkService: LinkService,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/')
    async createLink( @Body() createLinkDto: CreateLinkDto, @Res() res: Response, @Request() req) {
        const obj = await this.linkService.createLink(createLinkDto);

        this.userModel
            .findOneAndUpdate(
                { _id: req.user.id },
                { $push: { links: obj } },
                { returnDocument: 'after', upsert: true },
            )
            .then((data) => {
                res.json({
                    links: data.links,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    @UseGuards(JwtAuthGuard)
    @Put('/url/:id')
    async editUrl(@Param('id') id: string, @Res() res: Response, @Request() req, @Body() createLinkDto: CreateLinkDto) {
        const { url } = createLinkDto;

        this.userModel
            .findOneAndUpdate(
                { _id: req.user.id, 'links.id': id },
                { $set: { 'links.$.url': url } },
                { safe: true, returnDocument: 'after' },
            )
            .then((data) => {
                res.json({
                    links: data.links,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    @UseGuards(JwtAuthGuard)
    @Put('/caption/:id')
    async editCaption(@Param('id') id: string, @Res() res: Response, @Request() req, @Body() createLinkDto: CreateLinkDto) {
        const { caption } = createLinkDto;

        this.userModel
            .findOneAndUpdate(
                { _id: req.user.id, 'links.id': id },
                { $set: { 'links.$.caption': caption } },
                { safe: true, returnDocument: 'after' },
            )
            .then((data) => {
                res.json({
                    links: data.links,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteLink(@Param('id') id: string, @Res() res: Response, @Request() req) {
        this.userModel
            .findOneAndUpdate(
                { _id: req.user.id },
                { $pull: { links: { id: id } } },
                { safe: true, returnDocument: 'after' },
            )
            .then((data) => {
                res.json({
                    links: data.links,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
