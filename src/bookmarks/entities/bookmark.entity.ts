import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType({ isAbstract: true })
@ObjectType()
export class Bookmark extends CoreEntity {
  @Field(() => String, { description: '상품 ID' })
  product_id: string;

  @Field(() => String, { description: '유형 ( 커피, 차 등 )' })
  type: string;

  @Field(() => String, { description: '이름' })
  name: string;

  @Field(() => String, { description: '설명' })
  description: string;

  @Field(() => String, { description: '이미지' })
  image_url: string;

  @Field(() => [String], { description: '태그' })
  tags: string[];

  @Field()
  uid: string;
}
