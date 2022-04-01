import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Coffee {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  main_image: string;

  @Field()
  description: string;
  tags: string[];

  @Field()
  taste_body: string;

  @Field()
  taste_sweet: string;

  @Field()
  taste_bitter: string;

  @Field()
  taste_sour: string;

  @Field()
  type: string;

  @Field()
  roasting: string;

  @Field()
  roasting_date: Date;

  @Field()
  process: string;

  @Field(() => Boolean)
  public: boolean;

  @Field(/* () => DocumentReference */)
  company: string; //DocumentReference

  @Field()
  company_id: string;

  // related_coffee: EntityReference[];

  @Field()
  uid: string;

  @Field()
  created_at: Date;
}
