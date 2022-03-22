import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkInput } from './dto/create-bookmark.input';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { BookmarksOutput } from './dto/bookmark.output';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Role } from 'src/auth/roles.decorator';

@Resolver(() => Bookmark)
export class BookmarksResolver {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Role(['Login'])
  @Mutation(() => CoreOutput)
  createBookmark(
    @AuthUser() token: DecodedIdToken,
    @Args('input') createBookmarkInput: CreateBookmarkInput,
  ) {
    return this.bookmarksService.create(token, createBookmarkInput);
  }

  @Role(['Login'])
  @Query(() => BookmarksOutput, { name: 'bookmarks' })
  findAll(@AuthUser() token: DecodedIdToken) {
    return this.bookmarksService.findAll(token);
  }

  @Role(['Login'])
  @Mutation(() => CoreOutput)
  removeBookmark(
    @AuthUser() token: DecodedIdToken,
    @Args('id') productId: string,
  ) {
    return this.bookmarksService.remove(token, productId);
  }
}
