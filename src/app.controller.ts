import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiOperation({
    summary: `Fetch details of the short url, including the long url. 
      This will redirect you to the original page, returning the html. 
      You can view the HTML if you query using a browser/postman, but not using Swagger UI`,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully navigated to the orginal url',
  })
  @ApiForbiddenResponse({ description: 'Invalid short url' })
  @ApiNotFoundResponse({ description: 'Short url not found' })
  @Get('navigate')
  async navigate(
    @Query('shorturl') shorturl: string,
    @Res() res: express.Response,
  ) {
    const urlData = await this.appService.fetchUrlData(shorturl);
    res.redirect(urlData.originalUrl);
  }

  @ApiOperation({ summary: 'Navigate with the short url' })
  @Post()
  shorten(@Query('url') url: string): Promise<ShortUrl> {
    return this.appService.shortenUrl(url);
  }
}
