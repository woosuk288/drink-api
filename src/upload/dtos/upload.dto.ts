import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadImageFile {
  folderPath: string;
}
