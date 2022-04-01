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
import { getAsyncData, getData } from 'src/firebase/util';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationInput } from './dto/notification.input';
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
      const C = getFirestore().collection(COFFEES);
      let coffee: Coffee;
      if (type === 'coffee') {
        coffee = await getAsyncData<Coffee>(C.doc(product_id));
      } else {
        return { ok: false, error: '찾을 상품의 종류가 없습니다.' };
      }
      // const coffee = await getAsyncData<Coffee>(C.doc(product_id));
      const recipientCompanyRef =
        coffee.company as unknown as DocumentReference;

      const U = getFirestore().collection(USERS);
      const user = await getAsyncData<User>(U.doc(token.uid));
      const senderCompanyRef = user.company as unknown as DocumentReference;

      const N = getFirestore().collection(NOTIFICATIONS);

      const snaps = await N.where('sender_id', '==', senderCompanyRef.id)
        .where('product_id', '==', product_id)
        .limit(1)
        .get();

      if (snaps.size > 0) {
        return { ok: false, error: '이미 요청 했습니다.' };
      }

      const newNotification = {
        ...createNotificationInput,
        recipient_id: recipientCompanyRef.id,
        sender_id: senderCompanyRef.id,
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
      const U = getFirestore().collection(USERS);
      const user = await getAsyncData<User>(U.doc(token.uid));
      const userCompanyRef = user.company as unknown as DocumentReference;

      const c = getFirestore().collection(NOTIFICATIONS);

      const senderSnaps = await c
        .where('sender_id', '==', userCompanyRef.id)
        .limit(10)
        .get();
      const recipientSnaps = await c
        .where('recipient_id', '==', userCompanyRef.id)
        .limit(10)
        .get();

      const notifications = [
        ...senderSnaps.docs.map((doc) => getData<Notification>(doc)),
        ...recipientSnaps.docs.map((doc) => getData<Notification>(doc)),
      ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      return { ok: true, notifications };
    } catch (error) {
      return { ok: false };
    }
  }

  async findOne(token: DecodedIdToken, notificationInput: NotificationInput) {
    const { id } = notificationInput;

    const U = getFirestore().collection(USERS);
    const user = await getAsyncData<User>(U.doc(token.uid));
    const senderCompanyRef = user.company as unknown as DocumentReference;

    try {
      const notiRef = await getFirestore()
        .collection(NOTIFICATIONS)
        .doc(id)
        .get();

      const noti = notiRef.data() as Notification;
      if (
        !(
          senderCompanyRef.id === noti.sender_id ||
          senderCompanyRef.id === noti.recipient_id
        )
      ) {
        return { ok: false, error: '해당 알림을 볼 수 없습니다.' };
      }

      if (!notiRef.exists) {
        return { ok: false, error: '해당 알림이나 메시지가 없습니다.' };
      }

      let docRef: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
      if (noti.type === 'coffee') {
        docRef = await getFirestore()
          .collection('coffees')
          .doc(noti.product_id)
          .get();
      } else {
        return { ok: false, error: '찾을 상품의 종류가 없습니다.' };
      }

      const product = {
        id: docRef.id,
        title: docRef.data().name,
        image: docRef.data().main_image,
      };

      const sender = await getAsyncData<Company>(
        getFirestore().collection(COMPANIES).doc(noti.sender_id),
      );

      const recipient = await getAsyncData<Company>(
        getFirestore().collection(COMPANIES).doc(noti.recipient_id),
      );

      const senderCompany = {
        id: sender.id,
        company_name: sender.company_name,
        president_name: sender.president_name,
        telephone: sender.telephone,
      };
      const recipientCompany = {
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
