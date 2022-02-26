import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { DecodedIdToken } from 'src/firebase/firebase.interface';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): DecodedIdToken =>
    GqlExecutionContext.create(context).getContext().user,
);
