import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureSwagger } from './configs/swagger';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Some security
  app.enableCors();
  app.use(helmet());

  await configureSwagger(app);

  await app.listen(3000);
}

bootstrap();
