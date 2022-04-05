import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/roles.decorator';
import { CreatePaymentInput } from './dto/payment.input';
import { PaymentOutput } from './dto/payment.output';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Role(['Login'])
  @Mutation(() => PaymentOutput)
  createPayment(
    // @AuthUser() token: DecodedIdToken,
    @Args('input') createPaymentInput: CreatePaymentInput,
  ) {
    return this.paymentsService.create(/* token, */ createPaymentInput);
  }
}
