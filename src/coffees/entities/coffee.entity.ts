import { ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@ObjectType()
export class Coffee extends CoreEntity {
  @Field()
  name: string;

  @Field()
  image_url: string;

  @Field()
  description: string;

  @Field(() => [String], { defaultValue: [] })
  tags: string[];

  @Field({ nullable: true })
  taste_body?: string;

  @Field({ nullable: true })
  taste_sweet?: string;

  @Field({ nullable: true })
  taste_bitter?: string;

  @Field({ nullable: true })
  taste_sour?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  roasting?: string;

  @Field({ nullable: true })
  roasting_date?: Date;

  @Field({ nullable: true })
  process?: string;

  @Field(() => Boolean)
  public: boolean;

  @Field(/* () => DocumentReference */)
  company: string; //DocumentReference

  @Field()
  company_id: string;

  // related_coffee: EntityReference[];

  @Field({ nullable: true })
  uid?: string;
}
