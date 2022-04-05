import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field()
  orderId: string;

  @Field()
  amount: string;

  @Field()
  paymentKey: string;
}
