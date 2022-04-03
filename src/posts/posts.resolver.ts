import { Resolver, Query, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { PostOutput, PostsOutput } from './dto/post.output';
import { PostInput } from './dto/post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => PostsOutput, { name: 'posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Query(() => PostOutput, { name: 'post' })
  findOne(@Args('input') postInput: PostInput) {
    return this.postsService.findOne(postInput.id);
  }
}
