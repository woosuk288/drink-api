import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksResolver } from './bookmarks.resolver';

@Module({
  providers: [BookmarksResolver, BookmarksService],
})
export class BookmarksModule {}
