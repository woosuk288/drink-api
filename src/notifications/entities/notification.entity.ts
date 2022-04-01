import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType('NotificationEntityInput')
@ObjectType()
export class Notification extends CoreEntity {
  @Field({ description: '상품 id' })
  product_id: string;

  @Field({ description: '메시지' })
  message: string;

  // @Field(() => [String])
  // etc: string[];

  @Field({ description: '받는이' })
  recipient_id: string;

  @Field({ description: '보낸이' })
  sender_id: string;

  @Field(() => Boolean, { description: '읽음' })
  read: boolean;

  @Field({ description: '상품 유형' })
  type: string;
}
