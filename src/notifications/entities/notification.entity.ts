import { ObjectType, Field, InputType } from '@nestjs/graphql';

@InputType('NotificationInput')
@ObjectType()
export class Notification {
  @Field({ description: '상품 id' })
  product_id: string;

  @Field({ description: '메시지' })
  message: string;

  @Field(() => [String], { nullable: true })
  etc: string[];

  @Field({ description: '받는이' })
  recipient_id: string;

  @Field({ description: '보낸이' })
  sender_id: string;

  @Field(() => Boolean, { description: '읽음' })
  read: boolean;

  @Field({ description: 'DB' })
  type: string;
}
