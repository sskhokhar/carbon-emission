import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigSchema } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get<ConfigService<ConfigSchema>>(ConfigService);
  const port = configService.get('PORT', { infer: true }) ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
});
