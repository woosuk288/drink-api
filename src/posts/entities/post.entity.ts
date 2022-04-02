import { ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@ObjectType()
export class Post extends CoreEntity {
  @Field()
  name: string;

  @Field()
  image_url: string;

  @Field(() => [PostContent])
  content: PostContent[];

  @Field()
  publish_date: Date;

  @Field()
  status: string;

  @Field(() => [String])
  tags: string[];
}

@ObjectType()
class PostContent {
  @Field()
  type: string;

  @Field()
  value: string;
}
