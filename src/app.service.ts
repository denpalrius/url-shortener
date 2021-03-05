import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShortUrl, ShortUrlDocument } from './models/urls.model';
import * as crypto from 'crypto';

@Injectable()
export class AppService {
  private readonly baseUrl = 'https://mini.co/';

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
      if (existingShortUrl) return existingShortUrl;

      const shortUrl = this.generateShortURL(url, 0, 5);

      const newShortUrl = new ShortUrl({
        hash: shortUrl,
        originalUrl: url,
        createdAt: new Date(),
      });

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

  async fetchLongUrl(shorturl: string): Promise<string> {
    const hash = shorturl.trim().replace(this.baseUrl, '');

    const existingShortUrl = await this.shortUrlModel.findOne({ hash }).exec();

    if (existingShortUrl) {
      return existingShortUrl.hash;
    } else {
      throw new NotFoundException('Long url not found');
    }
  }
}
