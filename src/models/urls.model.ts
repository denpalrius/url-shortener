import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, MinLength } from 'class-validator';
import { Document } from 'mongoose';

export type ShortUrlDocument = ShortUrl & Document;

@Schema()
export class ShortUrl {
  constructor(intialData: Partial<ShortUrl> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Prop({ required: true, length: 6 })
  hash: string;

  @ApiProperty()
  @IsString()
  @Prop()
  shortUrl: string;

  @ApiProperty()
  @IsString()
  @Prop({ required: true })
  originalUrl: string;

  @ApiProperty()
  @IsDate()
  @Prop({ required: true })
  createdAt: Date;
}

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);
