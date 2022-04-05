import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';

@ObjectType()
class Card {
  @Field()
  company: string;
  @Field()
  number: string;
  @Field(() => Int)
  installmentPlanMonths: number;
  @Field(() => Boolean)
  isInterestFree: boolean;
  @Field()
  approveNo: string;
  @Field(() => Boolean)
  useCardPoint: boolean;
  @Field()
  cardType: string;
  @Field()
  ownerType: string;
  @Field()
  acquireStatus: string;
  @Field()
  receiptUrl: string;
}

@ObjectType()
export class Payment {
  @Field()
  mId: string;
  @Field({ nullable: true })
  version: string;
  @Field()
  paymentKey: string;
  @Field()
  orderId: string;
  @Field({ nullable: true })
  orderName: string;
  @Field()
  currency: string;
  @Field()
  method: string;
  @Field()
  status: string;
  @Field()
  requestedAt: string;
  @Field()
  approvedAt: string;
  @Field(() => Boolean)
  useEscrow: boolean;
  @Field(() => Boolean, { nullable: true })
  cultureExpense: boolean;

  @Field({ nullable: true })
  card: Card | null;

  @Field({ nullable: true })
  virtualAccount: string;
  @Field({ nullable: true })
  transfer: string;
  @Field({ nullable: true })
  mobilePhone: string;
  @Field({ nullable: true })
  giftCertificate: string;
  @Field({ nullable: true })
  foreignEasyPay: string;
  @Field({ nullable: true })
  cashReceipt: string;
  @Field({ nullable: true })
  discount: string;
  @Field({ nullable: true })
  cancels: string;
  @Field({ nullable: true })
  secret: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  easyPay: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  failure: string;
  @Field(() => Int)
  totalAmount: number;
  @Field(() => Int)
  balanceAmount: number;
  @Field(() => Int, { nullable: true })
  suppliedAmount: number;
  @Field(() => Int, { nullable: true })
  vat: number;
  @Field(() => Int, { nullable: true })
  taxFreeAmount: number;
}

@ObjectType()
export class PaymentOutput extends CoreOutput {
  @Field(() => Payment, { nullable: true })
  payment?: Payment;
}
