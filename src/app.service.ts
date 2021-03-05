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
  private readonly baseUrl = 'https://eofgp.ly/';

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

      // Look for existing url and return it if found
      const shorteUrlHash = this.shortenURL(url);

      const existingShortUrl = await this.shortUrlModel
        .findOne({ hash: shorteUrlHash })
        .exec();
      if (existingShortUrl) return existingShortUrl;

      const shortUrlHash = this.shortenURL(url);

      const newShortUrl = new ShortUrl({
        hash: shortUrlHash,
        shortUrl: this.baseUrl + shortUrlHash,
        originalUrl: url,
        createdAt: new Date(),
      });

      return await new this.shortUrlModel(newShortUrl).save();
    } catch (error) {
      Logger.log(error);
      throw new InternalServerErrorException('Error generating shortened url.');
    }
  }

  private shortenURL(longURL: crypto.BinaryLike): string {
    const start = 0;
    const end = 6;

    return crypto
      .createHash('md5')
      .update(longURL)
      .digest('base64') // 64⁶ unique urls
      .replace(/\//g, '_') // Url safety
      .replace(/\+/g, '-')
      .substring(start, end);
  }

  async fetchUrlData(shorturl: string): Promise<ShortUrl> {
    if (!shorturl) {
      throw new UnprocessableEntityException('Invalid short url');
    }

    const hash = shorturl.trim().replace(this.baseUrl, '');
    const existingShortUrl = await this.shortUrlModel.findOne({ hash }).exec();

    if (!existingShortUrl) {
      throw new NotFoundException('Short url not found');
    }
    return existingShortUrl;
  }
}
