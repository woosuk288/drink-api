import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

const NOTIFICATIONS = 'notifications';

@Injectable()
export class NotificationsService {
  async create(
    token: DecodedIdToken,
    createNotificationInput: CreateNotificationInput,
  ) {
    try {
      const c = getFirestore().collection(NOTIFICATIONS);

      const snaps = await c
        .where('sender_id', '==', token.uid)
        .where('product_id', '==', createNotificationInput.product_id)
        .limit(1)
        .get();

      if (snaps.size > 0) {
        return { ok: false, error: '이미 요청 했습니다.' };
      }

      const result = await c.add(createNotificationInput);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationInput: UpdateNotificationInput) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
