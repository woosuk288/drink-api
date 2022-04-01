import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCoffeeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
