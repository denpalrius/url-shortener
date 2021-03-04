import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, MinLength } from 'class-validator';
import { Document } from 'mongoose';

export type ShortUrlDocument = ShortUrl & Document;

@Schema()
export class ShortUrl {
  constructor(intialData: Partial<ShortUrl> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @IsString({})
  @MinLength(5)
  @Prop({ required: true, length: 6 })
  code: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
