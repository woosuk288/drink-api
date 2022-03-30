import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Role } from 'src/auth/roles.decorator';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthUser } from 'src/auth/auth-user.decorator';

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

  @Query(() => [Notification], { name: 'notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Query(() => Notification, { name: 'notification' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Mutation(() => Notification)
  updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationsService.update(
      updateNotificationInput.id,
      updateNotificationInput,
    );
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationsService.remove(id);
  }
}
