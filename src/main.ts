import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'firebase-functions';
import { AppModule } from './app.module';
import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firebaseConfig } from './firebase/config';
import * as express from 'express';

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: process.env.NODE_ENV === 'dev' ? ['log'] : ['error'] },
  );

  // Initialize the firebase admin app
  firebaseAdmin.initializeApp(firebaseConfig);

  app.enableCors();
  // return app.init();
  return process.env.NODE_ENV === 'dev'
    ? app.listen(process.env.PORT || 4010)
    : app.init();
};

createNestServer(server)
  .then(() => console.log('Nest Ready : env : ', process.env.NODE_ENV))
  .catch((error) => console.error('Nest broken', error));

export const api = functions.region('asia-northeast3').https.onRequest(server);

// TODO: better-firebase-functions
// export * from './firebase/trggers';
// export * from './firebase/schedules';
