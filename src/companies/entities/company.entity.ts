import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType({ isAbstract: true })
@ObjectType()
export class Company extends CoreEntity {
  @Field(() => String, { description: '사업자등록번호' })
  businessNumber: string;

  @Field(() => String, { description: '회사이름' })
  companyName: string;

  @Field(() => String, { description: '대표자성명' })
  presidentName: string;

  @Field(() => String, { description: '개업일자' })
  openingDate: string;

  @Field(() => String, { description: '사업자등록증' })
  businessLicence: string;

  @Field(() => Boolean)
  isValid: boolean;

  @Field()
  uid: string;
}
