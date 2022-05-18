import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Company } from '../entities/company.entity';

@InputType()
export class CreateCompanyInput extends OmitType(Company, [
  'id',
  'created_at',
  'updated_at',
  'uid',
]) {}

@InputType()
export class RegisterInput {
  @Field({ nullable: true })
  ip?: string;

  @Field({ description: '전화번호 or 이메일' })
  contact: string;
}
