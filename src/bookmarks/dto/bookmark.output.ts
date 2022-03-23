import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { Bookmark } from '../entities/bookmark.entity';

@ObjectType()
export class BookmarksOutput extends CoreOutput {
  @Field(() => [Bookmark], { nullable: true })
  bookmarks?: Bookmark[];
}

@ObjectType()
export class CreateBookmarkOutput extends CoreOutput {
  @Field(() => Bookmark, { nullable: true })
  bookmark?: Bookmark;
}
