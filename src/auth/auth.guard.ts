import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // 아무나
    if (!roles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();

    const token: string =
      gqlContext.req.headers.authorization?.split('Bearer ')[1];

    // 아무나 + 유저정보 필요할 때
    if (roles.includes('Any')) {
      if (token) {
        return getAuth()
          .verifyIdToken(token)
          .then((userClaims) => {
            gqlContext['user'] = userClaims;
            return true;
          })
          .catch((error) => {
            console.log('error : ', error);
            gqlContext['user'] = null;
            return false;
          });
      } else {
        gqlContext['user'] = null;
        return true;
      }
    }

    // 로그인 필요
    if (!token) return false;

    return getAuth()
      .verifyIdToken(token)
      .then((userClaims) => {
        if (
          roles.includes('Login') ||
          roles.some((role) => userClaims[role] === true)
        ) {
          // console.log('userClaims.Admin : ', userClaims.Admin);

          gqlContext['user'] = userClaims;

          return true;
        }
        return false;
      })
      .catch((error) => {
        console.log({ error });
        return false;
      });
  }
}
