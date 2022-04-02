import { ObjectType, Field, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { Coffee } from '../entities/coffee.entity';

@ObjectType()
class CoffeeClient extends OmitType(Coffee, ['company'], ObjectType) {}

@ObjectType()
export class CoffeesOutput extends CoreOutput {
  @Field(() => [CoffeeClient], { nullable: true })
  coffees?: CoffeeClient[];
}

@ObjectType()
export class CoffeeOutput extends CoreOutput {
  @Field(() => CoffeeClient, { nullable: true })
  coffee?: CoffeeClient;
}
