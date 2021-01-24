import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://bookapp-angular.netlify.com',
      'https://bookapp-angular.netlify.app',
      'https://bookapp-react.netlify.app',
    ],
  });

  app.use('/ping', (_: unknown, res: any) => {
    res.send('ok');
  });

  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
