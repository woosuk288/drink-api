import { Injectable } from '@nestjs/common';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';

// import { db } from 'src/firebase/firebase.module';
import { getFirestore } from 'firebase-admin/firestore';
import { Company } from './entities/company.entity';
import { CompanyOutput } from './dto/company.output';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { getAuth } from 'firebase-admin/auth';
import { UserRole } from 'src/auth/roles.decorator';
import { CREATE, C_, getAsync } from 'src/firebase/util';

const COMPANNIES = 'companies';
const USERS = 'users';
/**
 * 사업자 진위확인
 * https://www.data.go.kr/iim/api/selectAPIAcountView.do#/%EC%82%AC%EC%97%85%EC%9E%90%EB%93%B1%EB%A1%9D%EC%A0%95%EB%B3%B4%20%EC%A7%84%EC%9C%84%ED%99%95%EC%9D%B8%20API/validate
 */
const URL =
  'https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=uV6%2FNfCOMqw8SKe0u3LfrYDBgDPf%2FqHQ4m4ImPJXFIPHDVgaOO0zhfxtVV17Qz%2BWzYM3zHf8n67Au28yZJpnoQ%3D%3D';

@Injectable()
export class CompaniesService {
  async create(
    token: DecodedIdToken,
    createCompanyInput: CreateCompanyInput,
  ): Promise<CompanyOutput> {
    // console.log('createCompanyInput : ', createCompanyInput);

    const c = getFirestore().collection(COMPANNIES);

    try {
      // const snaps = await c.where('uid', '==', token.uid).limit(1).get();
      // // 실행되서는 안되는 코드 (추후 동일한 아이디로 사업자 2개 등록 해야할 경우엔 로직 변경 필요)
      // if (snaps.size > 0) {
      //   const error = '이미 사업자 회원 입니다.';
      //   // await getAuth().setCustomUserClaims(token.uid, { error });
      //   return { ok: false, error };
      // }

      //
      const snaps2 = await c
        .where('business_number', '==', createCompanyInput.business_number)
        .limit(1)
        .get();

      if (snaps2.size > 0) {
        const error = '이미 등록된 사업자입니다.';
        // await getAuth().setCustomUserClaims(token.uid, { error });
        return { ok: false, error };
      }

      const u = getFirestore().collection(USERS);
      const userDoc = await u.doc(token.uid).get();
      const errorCount = (userDoc.data().errorCount ?? 0) + 1;

      if (errorCount >= 3) {
        await u.doc(token.uid).update({ errorCount });
        return { ok: false, error: '시도 횟수를 초과했습니다.' };
      }

      const company: Company = {
        ...createCompanyInput,
        ...CREATE(),
        uid: token.uid,
      };

      const dataForValidation = {
        businesses: [
          {
            b_no: createCompanyInput.business_number,
            start_dt: createCompanyInput.opening_date,
            p_nm: createCompanyInput.president_name,
            p_nm2: '',
            b_nm: createCompanyInput.company_name,
            corp_no: '',
            b_sector: '',
            b_type: '',
          },
        ],
      };

      const r = await axios.post(URL, dataForValidation);
      // console.log('r.data : ', r.data);

      if (r.data.valid_cnt !== 1) {
        // count ++
        await u.doc(token.uid).update({ errorCount });
        return {
          ok: false,
          error:
            '사업자 정보 입력이 정확하지 않습니다. \n남은 횟수 : ' +
            (3 - errorCount),
        };
      }

      // 사업자 생성
      const newCompanyRef = await c.add(company);
      company.id = newCompanyRef.id;
      await getAuth().setCustomUserClaims(token.uid, {
        Company: company.id,
      });

      u.doc(token.uid).update({ company_id: company.id });

      console.log('company : ', company);
      return { ok: true, company, role: UserRole.Company };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '사업자 정보를 등록하는 중 오류가 발생했습니다.',
      };
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  async findOne(token: DecodedIdToken) {
    try {
      const company = await getAsync<Company>(
        C_(COMPANNIES).doc(token.Company),
      );

      return { ok: true, company, UserRole: UserRole.Company };
    } catch (error) {
      return { ok: false, error: '회사 정보를 조회하는 중 오류 발생!' };
    }
  }

  async update(id: number, updateCompanyInput: UpdateCompanyInput) {
    return `This action updates a #${id} company`;
  }

  async remove(token: DecodedIdToken) {
    const userRecord = await getAuth().getUser(token.uid);

    console.log(userRecord.customClaims);

    // await getAuth().setCustomUserClaims(token.uid, null);
    return `This action removes a #${token.uid} company`;
  }
}
