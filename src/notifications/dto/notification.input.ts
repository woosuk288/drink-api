import { InputType, PickType } from '@nestjs/graphql';
import { Notification } from '../entities/notification.entity';

@InputType()
export class NotificationInput extends PickType(Notification, ['id']) {}
