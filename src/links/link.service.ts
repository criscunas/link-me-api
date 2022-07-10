import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateLinkDto } from './dto/create-link-dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LinkService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async createLink(createLinkDto: CreateLinkDto): Promise<any> {
        const { site, url, caption } = createLinkDto;

        let obj = {
            id: uuidv4(),
            site: site,
            url: url,
            caption: caption,
            img_path: `http://localhost:3000/${site}.svg`,
        };

        return obj;
    }

    async getUserLinks(id: string): Promise<any> {
        let user = await this.userModel.findById(id);
        return user.links;
    }
}
