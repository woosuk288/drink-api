import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/**
 * nestjs 서버 사용하여 보낼 때 받을 때 둘 다 GraphQLISODateTime ( ISOString ) 반환
 * 공식문서 내용 : The GraphQLISODateTime (e.g. 2019-12-03T09:54:33Z) is used by default to represent the Date type.
 */

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar type';

  // 클라이언트에서 데이터 객체로 보낸 걸 서버에서 받을 때

  parseValue(value: string | number): Date {
    return new Date(value); // value from the client
  }

  // 서버에서 클라이언트로 보낼 때
  serialize(value) {
    // value sent to the client if value is firebase.firestore.Timestamp
    if (typeof value.toDate === 'function') {
      return value.toDate();
    }

    // Date object sent to the client
    return value.toISOString();
  }

  // 클라이언트에서 number, string으로 보낸 걸 서버에서 받을 때
  parseLiteral(ast: ValueNode): Date {
    // console.log('ast : ', ast);
    // console.log('Kind.INT : ', Kind.INT);
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }

    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }

    return null;
  }
}
