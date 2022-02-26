import { ForbiddenException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuidV4 } from 'uuid';

import * as Busboy from 'busboy';

import { FileInfo } from './file-info';

@Injectable()
export class FileInterceptorService {
  interceptRequest(
    request,
    options?: {
      onFile?: () => void;
      headers?: any;
      fileUniqueId?: string;
    },
  ): Promise<{ fields: { [key: string]: any }; files?: Array<FileInfo> }> {
    options = options || {};
    options.headers = options.headers || request.headers;
    const customOnFile =
      typeof options.onFile === 'function' ? options.onFile : false;
    const fileUniqueId = options.fileUniqueId || uuidV4();
    delete options.onFile;

    // const Busboy = require('busboy');
    const busboy = new Busboy({
      ...options,
      limits: {
        // Cloud functions impose this restriction anyway
        // fileSize: 10 * 1024 * 1024,
        fileSize: 1 * 1024 * 1024,
        files: 10,
      },
    });

    return new Promise<{
      fields: { [key: string]: any };
      files?: Array<FileInfo>;
    }>((resolve, reject) => {
      const fields = {};
      const filePromises: Array<Promise<FileInfo>> = [];

      const cleanup = () => {
        busboy.removeListener('field', this.onField);
        busboy.removeListener('file', customOnFile || this.onFile);
        busboy.removeListener('close', cleanup);
        busboy.removeListener('end', cleanup);
        busboy.removeListener('error', onEnd);
        busboy.removeListener('partsLimit', onEnd);
        busboy.removeListener('filesLimit', onEnd);
        busboy.removeListener('fieldsLimit', onEnd);
        busboy.removeListener('finish', onEnd);
      };

      const onError = (err) => {
        cleanup();
        return reject(err);
      };

      const onEnd = (err) => {
        if (err) {
          return reject(err);
        }
        if (customOnFile) {
          cleanup();
          resolve({ fields: fields });
        } else {
          Promise.all(filePromises)
            .then((files) => {
              cleanup();
              resolve({ fields: fields, files: files });
            })
            .catch(reject);
        }
      };

      request.on('close', cleanup.bind(this));

      busboy
        .on('field', this.onField.bind(this, fields))
        .on(
          'file',
          customOnFile || this.onFile.bind(this, filePromises, fileUniqueId),
        )
        .on('close', cleanup.bind(this))
        .on('error', onError.bind(this))
        .on('end', onEnd.bind(this))
        .on('finish', onEnd.bind(this));

      busboy.on('partsLimit', () => {
        const err = new ForbiddenException('Reach parts limit');
        onError(err);
      });

      busboy.on('filesLimit', () => {
        const err = new ForbiddenException('Reach files limit');
        onError(err);
      });

      busboy.on('fieldsLimit', () => {
        const err = new ForbiddenException('Reach fields limit');
        onError(err);
      });

      request.pipe(busboy);

      // busboy.end(request.body);

      // console.log('env : ', process.env.NODE_ENV);
      if (process.env.NODE_ENV === 'production') {
        busboy.end(request.rawBody);
      }
    });
  }

  deleteFiles(files: Array<FileInfo>): void {
    files.forEach((file) => {
      fs.unlinkSync(file.fileName);
    });
  }

  private onField(
    fields,
    name: string,
    val: any,
    fieldNameTruncated,
    valTruncated,
  ) {
    if (name.indexOf('[') > -1) {
      const obj = this.objectFromBluePrint(this.extractFormData(name), val);
      this.reconcile(obj, fields);
    } else {
      if (fields.hasOwnProperty(name)) {
        if (Array.isArray(fields[name])) {
          fields[name].push(val);
        } else {
          fields[name] = [fields[name], val];
        }
      } else {
        fields[name] = val;
      }
    }
  }

  private onFile(
    filePromises: Array<Promise<FileInfo>>,
    fileUniqueId: string,
    fieldName: string,
    file: NodeJS.ReadableStream,
    fileName: string,
    encoding: string,
    mimeType: string,
  ) {
    const tmpName = `${fileUniqueId}-${path.basename(fileName)}`;
    const saveTo = path.join(os.tmpdir(), path.basename(tmpName));
    const writeStream = fs.createWriteStream(saveTo);

    const filePromise = new Promise<FileInfo>((resolve, reject) =>
      writeStream
        .on('open', () =>
          file
            .pipe(writeStream)
            .on('error', reject)
            .on('finish', () => {
              const fileInfo = {
                fieldName: fieldName,
                fileName: saveTo,
                encoding: encoding,
                mimeType: mimeType,
              };

              resolve(fileInfo);
            }),
        )
        .on('error', (err) => {
          file.resume().on('error', reject);
          reject(err);
        }),
    );

    filePromises.push(filePromise);
  }

  private extractFormData = (str: string) => {
    const arr = str.split('[');
    const first = arr.shift();
    const res = arr.map((v) => v.split(']')[0]);
    res.unshift(first);
    return res;
  };

  private objectFromBluePrint = (arr, value) => {
    return arr.reverse().reduce((acc, next) => {
      if (Number(next).toString() === 'NaN') {
        return { [next]: acc };
      } else {
        const newAcc = [];
        newAcc[Number(next)] = acc;
        return newAcc;
      }
    }, value);
  };

  private reconcile = (obj, target) => {
    const key = Object.keys(obj)[0];
    const val = obj[key];

    if (target.hasOwnProperty(key)) {
      return this.reconcile(val, target[key]);
    } else {
      return (target[key] = val);
    }
  };
}
