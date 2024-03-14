import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000'
  });
  app.setGlobalPrefix('api');
  const port = process.env.PROJECT_PORT;
  await app.listen(port, ()=>console.log(`project running on port:${port}`));
}
bootstrap();
