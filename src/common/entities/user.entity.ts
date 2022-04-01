import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from './core.entity';

@ObjectType()
export class User extends CoreEntity {
  @Field()
  company: string; //DocumentReference

  @Field()
  createdAt: Date;

  @Field()
  disabled: boolean;

  @Field()
  displayName: string;

  @Field()
  email: string;

  @Field()
  emailVerified: boolean;

  @Field()
  phoneNumber: string;

  @Field()
  photoURL: string;

  @Field()
  providerId: string;

  @Field()
  uid: string;
}
