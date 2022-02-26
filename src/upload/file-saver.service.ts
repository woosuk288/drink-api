import { Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { v4 as uuidV4 } from 'uuid';
import * as path from 'path';
import { BUCKET_NAME } from 'src/common/common.constants';

@Injectable()
export class FileSaverService {
  async saveFile(
    fileName: string,
    mimeType: string,
    destinationFolder: string,
  ) {
    // const path = require('path');

    const bucket = admin.storage().bucket(BUCKET_NAME);

    const [file, meta] = await bucket.upload(fileName, {
      destination: `${destinationFolder}/${path.basename(fileName)}`,
      resumable: false,
      public: true,
      metadata: {
        contentType: mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuidV4(),
        },
      },
    });

    // console.log('meta: ', meta);
    return meta.mediaLink;
  }
}
