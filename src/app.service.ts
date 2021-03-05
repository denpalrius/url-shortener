import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUrl, ShortUrlDocument } from './models/urls.model';
import * as crypto from 'crypto';
import { exception } from 'console';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(ShortUrl.name)
    private shortUrlModel: Model<ShortUrlDocument>,
  ) {}

  async fetchAll(): Promise<ShortUrl[]> {
    return await this.shortUrlModel.find().exec();
  }

  async shortenUrl(url: string): Promise<ShortUrl> {
    try {
      if (!url) throw new UnprocessableEntityException('Invalid url');

      // Look for existing url and return it
      const shorteUrlHash = this.generateShortURL(url, 0, 5);

      const existingShortUrl = await this.shortUrlModel
        .findOne({ hash: shorteUrlHash })
        .exec();
      console.log('existingShortUrl:', existingShortUrl);
      if (existingShortUrl) return existingShortUrl;

      const newShortUrl = new ShortUrl({
        hash: this.generateShortURL(url, 0, 5),
        originalUrl: url,
        createdAt: new Date(),
      });

      console.log(newShortUrl);

      return new this.shortUrlModel(newShortUrl).save();
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException('Error generating shortened url.');
    }
  }

  private generateShortURL(
    longURL: crypto.BinaryLike,
    startIndex: number,
    endIndex: number,
  ): string {
    const hash = crypto
      .createHash('md5')
      .update(longURL)
      .digest('base64') // 64⁶ unique urls
      .replace(/\//g, '_') // Url safety
      .replace(/\+/g, '-');
    return hash.substring(startIndex, endIndex + 1);
  }
}
