import { Injectable } from '@nestjs/common';
import { COFFEES } from 'src/common/common.constants';
import { C_, getArray, getD } from 'src/firebase/util';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  async findAll() {
    try {
      const snaps = await C_(COFFEES)
        .limit(12)
        .orderBy('created_at', 'desc')
        .get();

      const coffees = getArray<Coffee>(snaps);

      return { ok: true, coffees };
    } catch (error) {
      return { ok: false, error: '데이터를 조회하는 중 오류 발생!' };
    }
  }

  async findOne(id: string) {
    try {
      const coffee = await getD<Coffee>(COFFEES, id);

      return { ok: true, coffee };
    } catch (error) {
      return { ok: false, error: '데이터를 조회하는 중 오류 발생' };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} coffee`;
  }
}
