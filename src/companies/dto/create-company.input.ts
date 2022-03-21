import { InputType, OmitType } from '@nestjs/graphql';
import { Company } from '../entities/company.entity';

@InputType()
export class CreateCompanyInput extends OmitType(Company, [
  'id',
  'created_at',
  'updated_at',
  'is_valid',
  'uid',
]) {}
