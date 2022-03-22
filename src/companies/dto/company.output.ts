import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { Company } from '../entities/company.entity';
import { UserRole } from 'src/auth/roles.decorator';

@ObjectType()
export class CompanyOutput extends CoreOutput {
  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
