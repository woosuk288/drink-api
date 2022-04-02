import { Injectable } from '@nestjs/common';
import { BLOG } from 'src/common/common.constants';
import { C_, getArray, getAsync } from 'src/firebase/util';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  async findAll() {
    try {
      const snaps = await C_(BLOG)
        .limit(12)
        .orderBy('created_at', 'desc')
        .get();

      const posts = getArray<Post>(snaps);

      return { ok: true, posts };
    } catch (error) {
      return { ok: false, error: '데이터를 조회하는 중 오류 발생!' };
    }
  }

  async findOne(id: string) {
    try {
      const post = await getAsync<Post>(C_(BLOG).doc(id));

      return { ok: true, post };
    } catch (error) {
      return { ok: false, error: '데이터를 조회하는 중 오류 발생' };
    }
  }
}
