import { Injectable } from '@nestjs/common';
import { CreateCompanyInput, RegisterInput } from './dto/create-company.input';

// import { db } from 'src/firebase/firebase.module';
import { getFirestore } from 'firebase-admin/firestore';
import { Company } from './entities/company.entity';
import { CompanyOutput } from './dto/company.output';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { getAuth } from 'firebase-admin/auth';
import { UserRole } from 'src/auth/roles.decorator';
import { CREATE, getD } from 'src/firebase/util';
import { COMPANIES } from 'src/common/common.constants';
import { readFile, writeFile } from 'fs/promises';

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

    const c = getFirestore().collection(COMPANIES);

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
      const company = await getD<Company>(COMPANIES, token.Company);

      return { ok: true, company, UserRole: UserRole.Company };
    } catch (error) {
      return { ok: false, error: '회사 정보를 조회하는 중 오류 발생!' };
    }
  }

  async update(id: string) {
    return `This action updates a #${id} company`;
  }

  async remove(token: DecodedIdToken) {
    const userRecord = await getAuth().getUser(token.uid);

    console.log(userRecord.customClaims);

    // await getAuth().setCustomUserClaims(token.uid, null);
    return `This action removes a #${token.uid} company`;
  }

  async registerTest(registerInput: RegisterInput) {
    try {
      if (registerInput.contact.length < 11) {
        return { ok: false, error: '요청 갑싱 잘못되었습니다.' };
      }

      const c = getFirestore().collection('registers');

      const queryOne = await c
        .where('contact', '==', registerInput.contact)
        .limit(1)
        .get();

      if (queryOne.size > 0) {
        return { ok: false, error: '이미 신청을 완료하셨습니다.' };
      }

      const query = await c.where('ip', '==', registerInput.ip).limit(11).get();

      if (query.size > 10) {
        return { ok: false, error: '요청 횟수를 초과했습니다.' };
      }

      await c.add({ ...registerInput, ...CREATE() });

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '등록 중 오류가 발생했습니다.' };
    }
  }

  async crawlingKoke() {
    try {
      const productsString = await readFile(
        'src/companies/products.json',
        'utf8',
      );
      const products: any[] = JSON.parse(productsString);

      console.log('length : ', products.length);

      const productDetailsPromises = () =>
        products.map((product) => {
          return axios.post('https://api.koke.kr/graphql', {
            operationName: 'GetProduct',
            variables: { id: product.id },
            query:
              'query GetProduct($id: ID!) {\n  product(id: $id) {\n    ...product\n    reviewsCount\n    seller {\n      ...seller\n      logo {\n        ...image\n        __typename\n      }\n      wallImages {\n        ...image\n        __typename\n      }\n      exposedSellerNotices {\n        id\n        message\n        __typename\n      }\n      __typename\n    }\n    coffeeDesc {\n      ...coffeeDesc\n      __typename\n    }\n    beans {\n      ...bean\n      __typename\n    }\n    offers {\n      ...offer\n      __typename\n    }\n    packageImage {\n      ...image\n      __typename\n    }\n    descriptionImages {\n      ...image\n      __typename\n    }\n    exposedSellerNotices {\n      id\n      message\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment product on Product {\n  id\n  name\n  note\n  essentialNotice\n  introduce\n  status\n  statusLabel\n  categoryCode\n  characters\n  tags\n  eventLabels\n  category {\n    ...category\n    __typename\n  }\n  exclusive\n  inHouse\n  minExpiration\n  createdAt\n  __typename\n}\n\nfragment category on Category {\n  code\n  name\n  __typename\n}\n\nfragment seller on Seller {\n  id\n  name\n  grindingSupported\n  introduce\n  address\n  socials\n  guarantee\n  shippingConditions {\n    origin\n    price\n    freeOrderPrice\n    jejuPrice\n    islandPrice\n    __typename\n  }\n  consultInfo\n  awards\n  specs {\n    key\n    value\n    __typename\n  }\n  __typename\n}\n\nfragment image on Image {\n  id\n  urls\n  position\n  __typename\n}\n\nfragment coffeeDesc on CoffeeDesc {\n  roastLevel\n  roastLevelLabel\n  roastingDays\n  brewingMethods\n  brewingMethodLabels\n  features\n  variations\n  flavors\n  characters\n  aroma\n  sweetness\n  acidity\n  bitterness\n  recipes {\n    key\n    value\n    __typename\n  }\n  mouthfeel\n  __typename\n}\n\nfragment bean on Bean {\n  id\n  name\n  variety\n  country\n  region\n  subregion\n  farm\n  grade\n  elevations\n  process\n  processLabel\n  processDetail\n  __typename\n}\n\nfragment offer on Offer {\n  id\n  origin\n  isSample\n  name\n  size\n  price\n  primary\n  status\n  rawPrice\n  priceHidden\n  nonInventory\n  availableStock\n  minQuantity\n  limited\n  limitDays\n  limitQuantity\n  __typename\n}',
          });
        });

      const details = await Promise.all(productDetailsPromises());

      const result = details.map((detail, i) => {
        console.log(
          `${i + 1} detail ${detail.data.data.product.id} `,
          detail.data.data.product,
        );
        return detail.data.data.product;
      });

      await writeFile(
        'src/companies/productsDetails.json',
        JSON.stringify(result),
      );

      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '크롤링 중 오류가 발생했습니다.' };
    }
  }
}
