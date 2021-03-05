import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('URL shortener API')
    .setDescription(
      'This is the OpenAPI documentation for the URL Shortener API',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
