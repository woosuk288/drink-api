import { Post, Req, Request } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Role } from 'src/auth/roles.decorator';
import { FileInterceptorService } from './file-interceptor-service';
import { FileSaverService } from './file-saver.service';

// TODO: Role 처리하기 @AuthUser() token: DecodedIdToken
// buisniess license uid값 앞에 추가
// customClaims에 error 있으면 업로드 불가하게
@Role(['Login'])
@Controller('upload')
export class UploadController {
  constructor(
    private fileSaverService: FileSaverService,
    private fileInterceptorService: FileInterceptorService,
  ) {}

  @Post('')
  async uploadFile(@Req() req: Request) {
    const { files, fields } =
      await this.fileInterceptorService.interceptRequest(req, {
        fileUniqueId: new Date().toLocaleString(),
      });

    // console.log('files: ', files);
    // console.log('fields: ', fields);

    // const folder = ``;
    const folder: string = fields.folderPath;

    const urls: string[] = [];

    await this.asyncForEach(files, async (file) => {
      const url = await this.fileSaverService.saveFile(
        file.fileName,
        file.mimeType,
        folder,
      );
      urls.push(url);
    });

    this.fileInterceptorService.deleteFiles(files);

    // console.log('urls : ', urls);

    return { urls };
  }

  async asyncForEach(
    array: Array<any>,
    callback: (item: any, index: number, array: Array<any>) => void,
  ): Promise<void> {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}

// import {
//   Body,
//   Controller,
//   Inject,
//   Post,
//   UploadedFile,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { Role } from 'src/auth/roles.decorator';
// import { FIREBASE } from 'src/common/common.constants';
// import { FirebaseAdmin } from 'src/firebase/firebase.interface';
// import { UploadImageFile } from './dtos/upload.dto';

// const BUCKET_NAME = 'deliverybook-e64d3.appspot.com';

// @Role(['Login'])
// @Controller('upload')
// export class UploadController {
//   constructor(@Inject(FIREBASE) private readonly fire: FirebaseAdmin) {}

//   async uploadFileImage(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: UploadImageFile,
//   ): Promise<string> {
//     const { /* filename,  */ buffer, originalname } = file;
//     const filename = `${new Date().toLocaleString()} | ${originalname}`;

//     const fileHandle = this.fire.storage
//       .bucket(BUCKET_NAME)
//       .file(`${body.folderPath}/${filename}`);
//     const [fileExists] = await fileHandle.exists();
//     if (fileExists === false) {
//       // return fileHandle.save(buffer);
//       await fileHandle.save(buffer);
//       const [apiResponse] = await fileHandle.makePublic();
//       // console.log('apiResponse : ', apiResponse);
//       const [metadata] = await fileHandle.getMetadata();
//       // console.log('metadata : ', metadata);
//       const url = metadata.mediaLink;
//       return new Promise((resolve, reject) => resolve(url));
//     }
//     // already exists
//     return new Promise((resolve, reject) => resolve(filename));
//   }

//   @Post('')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() body: UploadImageFile,
//   ) {
//     try {
//       const url = await this.uploadFileImage(file, body);
//       return { url };
//     } catch (error) {
//       console.log('uploadFile error: ', error);
//       return null;
//     }
//   }

//   @Post('files')
//   @UseInterceptors(FilesInterceptor('files', 10))
//   async uploadFiles(
//     @UploadedFiles() files: Array<Express.Multer.File>,
//     @Body() body: UploadImageFile,
//   ) {
//     try {
//       const urls = await Promise.all(
//         files.map((f) => this.uploadFileImage(f, body)),
//       );
//       return { urls };
//     } catch (error) {
//       console.log('uploadFiles error: ', error);
//       return null;
//     }
//   }
// }
