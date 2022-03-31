import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { Company } from 'src/companies/entities/company.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { NotificationInput } from './dto/notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { Notification } from './entities/notification.entity';

const NOTIFICATIONS = 'notifications';
const COMPANIES = 'companies';
// const USERS = 'users';

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

      await c.add(createNotificationInput);

      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }

  async findAll(token: DecodedIdToken) {
    try {
      const c = getFirestore().collection(NOTIFICATIONS);

      const senderSnaps = await c
        .where('sender_id', '==', token.uid)
        .limit(10)
        .get();
      const recipientSnaps = await c
        .where('recipient_id', '==', token.uid)
        .limit(10)
        .get();

      const notifications = [
        ...senderSnaps.docs.map(
          (d) =>
            ({
              id: d.id,
              ...d.data(),
              created_at: d.createTime.toDate(),
            } as Notification),
        ),
        ...recipientSnaps.docs.map(
          (d) =>
            ({
              id: d.id,
              ...d.data(),
              created_at: d.createTime.toDate(),
            } as Notification),
        ),
      ].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      console.log('notifications : ', notifications);

      return { ok: true, notifications };
    } catch (error) {
      return { ok: false };
    }
  }

  async findOne(token: DecodedIdToken, notificationInput: NotificationInput) {
    const { id } = notificationInput;

    try {
      const notiRef = await getFirestore()
        .collection(NOTIFICATIONS)
        .doc(id)
        .get();

      const noti = notiRef.data() as Notification;
      if (!(token.uid === noti.sender_id || token.uid === noti.recipient_id)) {
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

      const file = await getStorage().bucket().file(docRef.data().main_image);
      const [metadata] = await file.getMetadata();
      const url = metadata.mediaLink;

      const product = {
        id: docRef.id,
        title: docRef.data().name,
        image: url,
      };

      const senderSnaps = await getFirestore()
        .collection(COMPANIES)
        .where('uid', '==', noti.sender_id)
        .limit(1)
        .get();
      const sCompany = senderSnaps.docs[0].data() as Company;

      const recipientSnaps = await getFirestore()
        .collection(COMPANIES)
        .where('uid', '==', noti.recipient_id)
        .limit(1)
        .get();
      const rCompany = recipientSnaps.docs[0].data() as Company;

      const senderCompany = {
        id: senderSnaps.docs[0].id,
        company_name: sCompany.company_name,
        president_name: sCompany.president_name,
        telephone: '0101234',
      };
      const recipientCompany = {
        id: recipientSnaps.docs[0].id,
        company_name: rCompany.company_name,
        president_name: rCompany.president_name,
        telephone: '0105678',
      };

      console.log('product : ', product);
      console.log('senderCompany : ', senderCompany);
      console.log('recipientCompany : ', recipientCompany);

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
