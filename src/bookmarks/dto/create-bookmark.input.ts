import { InputType, OmitType } from '@nestjs/graphql';
import { Bookmark } from '../entities/bookmark.entity';

@InputType()
export class CreateBookmarkInput extends OmitType(Bookmark, [
  'uid',
  'id',
  'created_at',
  'updated_at',
]) {}
