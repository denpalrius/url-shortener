import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ShortUrl } from './models/urls.model';

@ApiTags('home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'View all shorten Urls' })
  @Get()
  async allAlbums(): Promise<ShortUrl[]> {
    return await this.appService.fetchAll();
  }

  @ApiOperation({ summary: 'Shorten url' ,parameters:[{url}]})
  @Post()
  shorten(@Body('url') url: string): Promise<ShortUrl> {
    return this.appService.shortenUrl(url);
  }
}
