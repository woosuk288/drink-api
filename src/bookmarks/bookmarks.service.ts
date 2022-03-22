import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { CREATE } from 'src/common/common.constants';
import { CreateBookmarkInput } from './dto/create-bookmark.input';

const BOOKMARKS = 'bookmarks';

@Injectable()
export class BookmarksService {
  async create(
    token: DecodedIdToken,
    createBookmarkInput: CreateBookmarkInput,
  ) {
    const uid = token.uid;
    try {
      const b = getFirestore().collection(BOOKMARKS);

      const qsOne = await b
        .where('uid', '==', uid)
        .where('product_id', '==', createBookmarkInput.product_id)
        .limit(1)
        .get();
      if (qsOne.size > 0) {
        return { ok: false, error: '이미 추가되었습니다.' };
      }

      await b.add({ ...createBookmarkInput, ...CREATE(), uid });
      return { ok: true };
    } catch (error) {
      console.log('error: ', error);
      return { ok: false, error: '추가하는 중 오류 발생!' };
    }
  }

  async findAll(token: DecodedIdToken) {
    try {
      const b = getFirestore().collection(BOOKMARKS);
      const qs = await b.where('uid', '==', token.uid).get();

      const bookmarks = qs.docs.map((d) => ({ id: d.id, ...d.data() }));

      return { ok: true, bookmarks };
    } catch (error) {
      console.error(error);
      return { ok: false, error: '조회 중 오류 발생!' };
    }
  }

  async remove(token: DecodedIdToken, productId: string) {
    const uid = token.uid;
    try {
      const b = getFirestore().collection(BOOKMARKS);

      const qsOne = await b
        .where('uid', '==', uid)
        .where('product_id', '==', productId)
        .limit(1)
        .get();
      if (qsOne.empty) {
        return { ok: false, error: '상품이 없습니다.' };
      }

      const bookmark = qsOne.docs[0].data();
      if (bookmark.uid !== uid) {
        return { ok: false, error: '제거할 권한이 없습니다.' };
      }

      await b.doc(qsOne.docs[0].id).delete();

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '제거하는 중 오류가 발생했습니다.' };
    }
  }
}
