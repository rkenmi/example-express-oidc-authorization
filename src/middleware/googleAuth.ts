import { OAuth2Client } from 'google-auth-library';
import { RequestHandler } from 'express';
import AuthException from '../exceptions/auth';
import { HTTP_UNAUTHORIZED } from '../constants/auth';
import { getBearerToken, UserProfile } from '../helpers/auth';
import { profileClient } from '../services/profileClient';

const GOOGLE_ANDROID_CLIENT_ID: string = process.env.GOOGLE_ANDROID_OAUTH_CLIENT_ID || '';
const GOOGLE_IOS_CLIENT_ID: string = process.env.GOOGLE_IOS_OAUTH_CLIENT_ID || '';

export class GoogleAuthException extends AuthException {
  readonly provider: string = 'Google';
}

export const googleOAuthClient = new OAuth2Client();
const googleAuth: RequestHandler = async (req, res, next): Promise<any> => {
  const idToken = getBearerToken(req);
  // Specify the CLIENT_ID of the app that accesses the backend
  // Or, if multiple clients access the backend:
  //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  await googleOAuthClient.verifyIdToken({
    idToken,
    audience: [
      GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID,
    ],
  }).then((token) => {
    const payload = token.getPayload();
    if (payload && payload.email && payload.given_name && payload.picture) {
      const { email, picture, given_name: name } = payload;
      req.body.profile = new UserProfile(email, name, picture);
      profileClient.saveProfile(idToken, req.body.profile);
    }
  }).catch(() => {
    throw new GoogleAuthException(HTTP_UNAUTHORIZED, 'Authentication Failure: Invalid token');
  });
};

export default googleAuth;
