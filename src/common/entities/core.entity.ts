import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreEntity {
  @Field()
  id: string;

  /**
   * date-scalar 사용하여 Date 타입 처리 중이지만, firebase 서버에서 받아오는 Timestamp 객체는 강제 형 변환 하여 사용 중.
   */

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
