import { InputType, PickType } from '@nestjs/graphql';
import { Notification } from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput extends PickType(Notification, [
  'product_id',
  'message',
  'type',
]) {}
