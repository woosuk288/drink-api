import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Role } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  NotificationOutput,
  NotificationsOutput,
} from './dto/notification.output';
import { NotificationInput } from './dto/notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Role(['Login'])
  @Mutation(() => CoreOutput)
  createNotification(
    @AuthUser() token: DecodedIdToken,
    @Args('input') createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(token, createNotificationInput);
  }

  @Role(['Login'])
  @Query(() => NotificationsOutput, { name: 'notifications' })
  findAll(@AuthUser() token: DecodedIdToken) {
    return this.notificationsService.findAll(token);
  }

  @Role(['Login'])
  @Query(() => NotificationOutput, { name: 'notification' })
  findOne(
    @AuthUser() token: DecodedIdToken,
    @Args('input') notificationInput: NotificationInput,
  ) {
    return this.notificationsService.findOne(token, notificationInput);
  }

  @Mutation(() => CoreOutput)
  updateNotification(
    @AuthUser() token: DecodedIdToken,
    @Args('input')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationsService.update(token, updateNotificationInput);
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.remove(id);
  }
}
