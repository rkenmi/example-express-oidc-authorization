import {Request} from 'express';

export const hasBearerTokenInHeaders = (req: Request) => req.headers.authorization
  && req.headers.authorization.split('Bearer ').length > 1;

export const getBearerToken = (req: Request) => req.headers.authorization?.split('Bearer ')[1] || 'MISSING_TOKEN';

export class UserProfile {
  id: string; // email, usually
  name: string; // first name, usually
  avatarURL?: string; // profile avatar URL

  constructor(id: string, name: string, avatarURL?: string) {
    this.id = id;
    this.name = name;
    this.avatarURL = avatarURL;
  }
}
