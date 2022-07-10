import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema ()
  export class User {
    
    @Prop()
      _id: string;

    @Prop({ required: true })
      username: string;
    
    @Prop({ required: true })
      password: string;

    @Prop()
      bio: string;

    @Prop([Object])
      links: [Object];

    @Prop()
      text_color: string;
    
    @Prop()
      bg_color: string;
      
    @Prop()
      username_color: string;
  
    @Prop()
      bio_color: string;
  }

export const UserSchema = SchemaFactory.createForClass(User)