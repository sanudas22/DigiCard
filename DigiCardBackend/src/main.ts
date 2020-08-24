import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import * as Express from 'express';
import * as cors from 'cors';

import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'test') {
  process.env.MONGO_URI = process.env.MONGO_URI_TEST;
  console.log('----------TESTING IN PROCESS----------');
  console.log('using database', process.env.MONGO_URI);
}

const server = Express();
server.use(cors());
server.get('/', (req, res) => res.send('ok'));
server.get('/_ah/health', (req, res) => res.send('ok'));
server.get('/_ah/start', (req, res) => res.send('ok'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const options = new DocumentBuilder()
  .setTitle('DigiCard API')
  .setDescription('backend of digicard app')
  .setVersion('1.0')
  .addTag('digicard')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}
bootstrap();