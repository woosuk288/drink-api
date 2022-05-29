import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput, RegisterInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { CompanyOutput } from './dto/company.output';
import { Role } from 'src/auth/roles.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { CoreOutput } from 'src/common/dtos/core.dto';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @Role(['Login'])
  @Mutation(() => CompanyOutput)
  createCompany(
    @AuthUser() token: DecodedIdToken,
    @Args('input') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(token, createCompanyInput);
  }

  @Query(() => [Company], { name: 'companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Role(['Login'])
  @Query(() => CompanyOutput, { name: 'company' })
  findOne(@AuthUser() token: DecodedIdToken) {
    return this.companiesService.findOne(token);
  }

  @Mutation(() => Company)
  updateCompany(@Args('input') updateCompanyInput: UpdateCompanyInput) {
    return this.companiesService.update(updateCompanyInput.id);
  }

  @Role(['Login'])
  @Mutation(() => String)
  removeCompany(@AuthUser() token: DecodedIdToken) {
    return this.companiesService.remove(token);
  }

  @Mutation(() => CoreOutput)
  registerTest(@Args('input') registerInput: RegisterInput) {
    return this.companiesService.registerTest(registerInput);
  }

  @Query(() => CoreOutput)
  crawlingKoke() {
    return this.companiesService.crawlingKoke();
  }
}
