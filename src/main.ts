import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import 'firebase-functions';
import { AppModule } from './app.module';
import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { join } from 'path';
import { BUCKET_NAME, PROJECT_ID } from './common/common.constants';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../serviceAccount.json');

const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: process.env.NODE_ENV === 'dev' ? ['log'] : ['error'] },
  );

  // Initialize the firebase admin app
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    storageBucket: BUCKET_NAME,
    projectId: PROJECT_ID,
  });

  app.enableCors();
  // app.useStaticAssets(join(__dirname, '..', 'src', 'public'));

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
