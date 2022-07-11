import * as firebaseAdmin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';
import * as url from 'url';

@Controller('auth')
export class AuthController {
  @Post('verifyToken')
  async verifyTokenWithKakao(@Body() body) {
    const token = body.token;
    if (!token) {
      return {
        ok: false,
        error: 'There is no token.',
        message: 'Access token is a required parameter.',
      };
    }

    console.log(`Verifying Kakao token: ${token}`);

    // createFirebaseToken
    try {
      const response = await this.requestMe(token);
      const body = response.data;
      console.log(body);

      if (!body.id) {
        throw {
          ok: false,
          error: 'There was no user with the given access token.',
        };
      }

      const userId = `kakao:${body.id}`;

      let nickname = null;
      let profileImage = null;
      if (body.properties) {
        nickname = body.properties.nickname;
        profileImage = body.properties.profile_image;
      }

      const userRecord = await this.updateOrCreateUser(
        userId,
        body.kaccount_email,
        nickname,
        profileImage,
      );

      const firebaseToken = await firebaseAdmin
        .auth()
        .createCustomToken(userRecord.uid, {
          provider: 'KAKAO',
        });

      // console.log(`Returning firebase token to user: ${firebaseToken}`);
      return { ok: true, firebaseToken };
    } catch (error) {
      console.log('error : ', error);

      return { ok: true, error: '로그인 처리 중 오류가 발생했습니다.' };
    }
  }

  /**
   * requestMe - Returns user profile from Kakao API
   *
   * @param  {String} kakaoAccessToken Access token retrieved by Kakao Login API
   * @return {Promiise<Response>}      User profile response in a promise
   */
  requestMe(kakaoAccessToken) {
    // Kakao API request url to retrieve user profile based on access token
    const requestMeUrl =
      'https://kapi.kakao.com/v2/user/me?secure_resource=true';

    console.log('Requesting user profile from Kakao API server.');

    return axios.get(requestMeUrl, {
      headers: {
        Authorization: 'Bearer ' + kakaoAccessToken,
      },
    });
  }

  /**
   * updateOrCreateUser - Update Firebase user with the give email, create if
   * none exists.
   *
   * @param  {String} userId        user id per app
   * @param  {String} email         user's email address
   * @param  {String} displayName   user
   * @param  {String} photoURL      profile photo url
   * @return {Prommise<UserRecord>} Firebase user record in a promise
   */
  updateOrCreateUser(userId, email, displayName, photoURL) {
    console.log('updating or creating a firebase user');

    const updateParams = {
      provider: 'KAKAO',
      displayName: displayName,
    };
    if (displayName) {
      updateParams['displayName'] = displayName;
    } else {
      updateParams['displayName'] = email;
    }
    if (photoURL) {
      updateParams['photoURL'] = photoURL;
    }

    console.log(updateParams);

    return getAuth()
      .updateUser(userId, updateParams)
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          updateParams['uid'] = userId;
          if (email) {
            updateParams['email'] = email;
          }
          return getAuth().createUser(updateParams);
        }
        throw error;
      });
  }

  // TODO: firebase logout 후 kakao도 logout 해야 하는지 잘 모르겠음. 일단 kakao도 logout (추후 다시 확인)
  @Post('logoutKakao')
  async logoutKakao(@Body() body) {
    try {
      // kakao:2270924324
      const target_id = body.kakaoUID;
      console.log('target_id : ', target_id);
      const params = new url.URLSearchParams({
        target_id_type: 'user_id',
        target_id,
      });

      const result = await axios.post(
        'https://kapi.kakao.com/v1/user/logout',
        params.toString(),
        {
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`,
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('result.data : ', result.data);
      // return result;
    } catch (error) {
      console.log('error.data: ', error.data);
    }
  }
}
