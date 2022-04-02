import { Resolver, Query, Args } from '@nestjs/graphql';
import { CoffeesService } from './coffees.service';
import { CoffeeInput } from './dto/coffee.input';
import { CoffeeOutput, CoffeesOutput } from './dto/coffee.output';
import { Coffee } from './entities/coffee.entity';

@Resolver(() => Coffee)
export class CoffeesResolver {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Query(() => CoffeesOutput, { name: 'coffees' })
  findAll() {
    return this.coffeesService.findAll();
  }

  @Query(() => CoffeeOutput, { name: 'coffee' })
  findOne(@Args('input') coffeeInput: CoffeeInput) {
    return this.coffeesService.findOne(coffeeInput.id);
  }
}
