import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType({ isAbstract: true })
@ObjectType()
export class Company extends CoreEntity {
  @Field(() => String, { description: '사업자등록번호' })
  business_number: string;

  @Field(() => String, { description: '회사이름' })
  company_name: string;

  @Field(() => String, { description: '대표자성명' })
  president_name: string;

  @Field(() => String, { description: '개업일자' })
  opening_date: string;

  @Field(() => String, { description: '사업자등록증' })
  business_licence: string;

  @Field(() => String, { description: '전화번호(회사)' })
  telephone: string;

  @Field(() => Boolean)
  is_valid: boolean;

  @Field()
  uid: string;
}
