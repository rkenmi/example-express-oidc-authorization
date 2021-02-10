import { RequestHandler } from 'express';
import AuthException from '../exceptions/auth';
import googleAuth from './googleAuth';
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from '../constants/auth';
import { getBearerToken, hasBearerTokenInHeaders, UserProfile } from '../helpers/auth';
import facebookAuth from './fbAuth';
import { profileClient } from '../services/profileClient';

const AUTH_HANDLERS = [googleAuth, facebookAuth];

const authMiddleware: RequestHandler = async (req, res, next) => {
  if (!hasBearerTokenInHeaders(req)) {
    res.status(HTTP_BAD_REQUEST).send('Invalid headers: no valid bearer token').end();
    return;
  }

  const cachedProfile: UserProfile = profileClient.getProfile(getBearerToken(req));
  if (cachedProfile) {
    req.body.profile = cachedProfile;
    next();
    return;
  }

  const errors: Array<AuthException> = [];
  await Promise.all(AUTH_HANDLERS.map(async (authHandler) => {
    try {
      if (!req.body.profile) {
        await authHandler(req, res, next);
      }
    } catch (err) {
      errors.push(err);
    }
  }));

  if (!req.body.profile && errors.length > 0) {
    res.status(HTTP_UNAUTHORIZED).send(errors.map((e) => `${e.provider} - ${e.status} - ${e.message}`)).end();
    return;
  }

  next();
};

export default authMiddleware;
