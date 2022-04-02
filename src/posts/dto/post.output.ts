import { ObjectType, Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostsOutput extends CoreOutput {
  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@ObjectType()
export class PostOutput extends CoreOutput {
  @Field(() => Post, { nullable: true })
  post?: Post;
}
