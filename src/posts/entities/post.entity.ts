import { ObjectType, Field /*,  createUnionType */ } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

// @ObjectType()
// export class ContentText {
//   @Field()
//   type: string;

//   @Field(() => String)
//   value: string;
// }

// @ObjectType()
// export class ContentImages {
//   @Field()
//   type: string;

//   @Field(() => [String])
//   value: string[];
// }

// export const PostContent = createUnionType({
//   name: 'PostContent',
//   types: () => [ContentText, ContentImages],
//   resolveType(value) {
//     if (value.type === 'text') {
//       return ContentText;
//     }
//     if (value.type === 'images') {
//       return ContentImages;
//     }
//     return null;
//   },
// });

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

  @Field(() => String)
  value: string;
}
