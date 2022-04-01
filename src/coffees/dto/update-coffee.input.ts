import { CreateCoffeeInput } from './create-coffee.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCoffeeInput extends PartialType(CreateCoffeeInput) {
  @Field(() => Int)
  id: number;
}
