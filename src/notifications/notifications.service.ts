import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { DocumentReference, getFirestore } from 'firebase-admin/firestore';
import { Coffee } from 'src/coffees/entities/coffee.entity';
import {
  COFFEES,
  COMPANIES,
  NOTIFICATIONS,
  USERS,
} from 'src/common/common.constants';
import { User } from 'src/common/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { C_, getArray, getD, getData } from 'src/firebase/util';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationInput } from './dto/notification.input';
import { NotiCompany, NotiProduct } from './dto/notification.output';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  async create(
    token: DecodedIdToken,
    createNotificationInput: CreateNotificationInput,
  ) {
    const { product_id, type } = createNotificationInput;

    try {
      let coffee: Coffee;
      if (type === 'coffee') {
        coffee = await getD<Coffee>(COFFEES, product_id);
      } else {
        return { ok: false, error: '찾을 상품의 종류가 없습니다.' };
      }
      // const coffee = await getAsyncData<Coffee>(C.doc(product_id));

      const N = getFirestore().collection(NOTIFICATIONS);

      const snaps = await N.where('sender_id', '==', token.Company)
        .where('product_id', '==', product_id)
        .limit(1)
        .get();

      if (snaps.size > 0) {
        return { ok: false, error: '이미 요청 했습니다.' };
      }

      const newNotification = {
        ...createNotificationInput,
        recipient_id: coffee.company_id,
        sender_id: token.Company,
        read: false,
      };

      await N.add(newNotification);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async findAll(token: DecodedIdToken) {
    try {
      const user = await getD<User>(USERS, token.uid);
      const userCompanyRef = user.company as unknown as DocumentReference;

      const senderSnaps = await C_(NOTIFICATIONS)
        .where('sender_id', '==', userCompanyRef.id)
        .limit(10)
        .get();
      const recipientSnaps = await C_(NOTIFICATIONS)
        .where('recipient_id', '==', userCompanyRef.id)
        .limit(10)
        .get();

      const notifications = [
        ...getArray<Notification>(senderSnaps),
        ...getArray<Notification>(recipientSnaps),
      ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      return { ok: true, notifications };
    } catch (error) {
      return { ok: false };
    }
  }

  async findOne(token: DecodedIdToken, notificationInput: NotificationInput) {
    const { id } = notificationInput;

    if (!token.Company) {
      return { ok: false, error: '사업자가 아닙니다.' };
    }

    try {
      const noti = await getD<Notification>(NOTIFICATIONS, id);

      if (
        !(
          token.Company === noti.sender_id ||
          token.Company === noti.recipient_id
        )
      ) {
        return { ok: false, error: '해당 알림을 볼 수 없습니다.' };
      }

      if (!noti) {
        return { ok: false, error: '해당 알림이나 메시지가 없습니다.' };
      }

      let product: NotiProduct;
      if (noti.type === 'coffee') {
        const { id, name, image_url } = await getD<Coffee>(
          COFFEES,
          noti.product_id,
        );
        product = { id, title: name, image: image_url };
      } else {
        return { ok: false, error: '찾을 상품의 종류가 없습니다.' };
      }

      const sender = await getD<Company>(COMPANIES, noti.sender_id);
      const recipient = await getD<Company>(COMPANIES, noti.recipient_id);

      const senderCompany: NotiCompany = {
        id: sender.id,
        company_name: sender.company_name,
        president_name: sender.president_name,
        telephone: sender.telephone,
      };
      const recipientCompany: NotiCompany = {
        id: recipient.id,
        company_name: recipient.company_name,
        president_name: recipient.president_name,
        telephone: recipient.telephone,
      };

      return { ok: true, product, senderCompany, recipientCompany };
    } catch (error) {
      console.log('error : ', error);
      return { ok: false, error: '내용을 조회하는 중 오류 발생!' };
    }
  }

  async update(
    token: DecodedIdToken,
    updateNotificationInput: UpdateNotificationInput,
  ) {
    // TODO: 중복 체크 및 데이터 값 비교
    // 이 상황에서는 rules에 resource.data 가 더 편하네?
    try {
      await Promise.all(
        updateNotificationInput.ids.map((id) =>
          getFirestore()
            .collection(NOTIFICATIONS)
            .doc(id)
            .update({ read: true }),
        ),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
