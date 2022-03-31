import { InputType } from '@nestjs/graphql';
import { Notification } from '../entities/notification.entity';

@InputType()
export class CreateNotificationInput extends Notification {}
