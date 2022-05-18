import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesResolver } from './coffees.resolver';

@Module({
  providers: [CoffeesResolver, CoffeesService],
})
export class CoffeesModule {}
