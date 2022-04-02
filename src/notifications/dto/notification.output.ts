import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/core.dto';
import { Company } from 'src/companies/entities/company.entity';
import { Notification } from '../entities/notification.entity';

@ObjectType()
export class NotificationsOutput extends CoreOutput {
  @Field(() => [Notification], { nullable: true })
  notifications?: Notification[];
}

@ObjectType()
export class NotiProduct {
  @Field()
  id: string;

  @Field()
  image: string;

  @Field()
  title: string;
}

@ObjectType()
export class NotiCompany extends PickType(
  Company,
  ['id', 'company_name', 'president_name'],
  ObjectType,
) {
  @Field()
  telephone: string;
}

@ObjectType()
export class NotificationOutput extends CoreOutput {
  @Field(() => NotiProduct, { nullable: true })
  product?: NotiProduct;

  @Field(() => NotiCompany, { nullable: true })
  senderCompany?: NotiCompany;

  @Field(() => NotiCompany, { nullable: true })
  recipientCompany?: NotiCompany;
}
