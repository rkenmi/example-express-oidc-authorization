import { RequestHandler } from 'express';
import AuthException from '../exceptions/auth';
import { getBearerToken, UserProfile } from '../helpers/auth';
import { HTTP_UNAUTHORIZED } from '../constants/auth';
import { profileClient } from '../services/profileClient';

const axios = require('axios');

const ME_FACEBOOK_API = 'https://graph.facebook.com/me';

export class FacebookAuthException extends AuthException {
  readonly provider: string = 'Facebook';
}

const facebookAuth: RequestHandler = async (req, res, next): Promise<any> => {
  const idToken = getBearerToken(req);
  const result = await axios({
    url: ME_FACEBOOK_API,
    method: 'get',
    params: {
      fields: ['first_name', 'email', 'picture'].join(','),
      access_token: idToken,
    },
  }).catch((err: Error) => {
    throw new FacebookAuthException(HTTP_UNAUTHORIZED, 'Authentication Failure: Invalid token');
  });

  if (result && result.data) {
    const { email, picture, first_name: firstName } = result.data;
    req.body.profile = new UserProfile(email, firstName, picture.data.url);
    profileClient.saveProfile(idToken, req.body.profile);
  }
};

export default facebookAuth;
