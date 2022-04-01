import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { UpdateCoffeeInput } from './dto/update-coffee.input';

@Resolver(() => Coffee)
export class CoffeesResolver {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Mutation(() => Coffee)
  createCoffee(@Args('createCoffeeInput') createCoffeeInput: CreateCoffeeInput) {
    return this.coffeesService.create(createCoffeeInput);
  }

  @Query(() => [Coffee], { name: 'coffees' })
  findAll() {
    return this.coffeesService.findAll();
  }

  @Query(() => Coffee, { name: 'coffee' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coffeesService.findOne(id);
  }

  @Mutation(() => Coffee)
  updateCoffee(@Args('updateCoffeeInput') updateCoffeeInput: UpdateCoffeeInput) {
    return this.coffeesService.update(updateCoffeeInput.id, updateCoffeeInput);
  }

  @Mutation(() => Coffee)
  removeCoffee(@Args('id', { type: () => Int }) id: number) {
    return this.coffeesService.remove(id);
  }
}
