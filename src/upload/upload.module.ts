import { Module } from '@nestjs/common';
import { FileInterceptorService } from './file-interceptor-service';
import { FileSaverService } from './file-saver.service';
import { UploadController } from './upload.controller';

@Module({
  providers: [FileInterceptorService, FileSaverService],
  controllers: [UploadController],
})
export class UploadModule {}
