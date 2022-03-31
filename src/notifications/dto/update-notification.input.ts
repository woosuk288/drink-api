import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput {
  @Field(() => [String])
  ids: string[];
}
