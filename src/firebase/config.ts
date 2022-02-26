import { AppOptions } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { BUCKET_NAME } from 'src/common/common.constants';

export const firebaseConfig: AppOptions = {
  credential: applicationDefault(),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
  storageBucket: BUCKET_NAME,
  projectId: 'foodoverflow-bca6d',
};
