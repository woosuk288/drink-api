import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class PostInput {
  @Field()
  id: string;
}
