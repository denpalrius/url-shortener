import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ShortUrl } from './models/urls.model';
import * as express from 'express';

@ApiTags('home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'View all shorten Urls' })
  @Get()
  async allAlbums(): Promise<ShortUrl[]> {
    return await this.appService.fetchAll();
  }

  @ApiOperation({ summary: 'Navigate with the short url' })
  @Post()
  shorten(@Body('url') url: string): Promise<ShortUrl> {
    return this.appService.shortenUrl(url);
  }

  @ApiOperation({ summary: 'Navigate with the short url' })
  @Get('navigate')
  async navigate(
    @Query('shorturl') shorturl: string,
    @Res() res: express.Response,
  ) {
    const longUrl = await this.appService.fetchLongUrl(shorturl);
    res.redirect(longUrl);
  }
}
