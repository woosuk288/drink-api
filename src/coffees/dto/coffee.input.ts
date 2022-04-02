import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CoffeeInput {
  @Field()
  id: string;
}
