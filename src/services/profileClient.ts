import { UserProfile } from '../helpers/auth';

interface TokenProfileMap {
  [profile: string]: UserProfile
}

export interface ProfileClientInterface {
  saveProfile(idToken: string, profileData: UserProfile): void;
  getProfile(idToken: string): UserProfile;
}

export default class LocalCacheProfileClient implements ProfileClientInterface {
  cache: TokenProfileMap;

  constructor() {
    this.cache = {};
  }

  saveProfile(idToken: string, profileData: UserProfile): void {
    this.cache[idToken] = profileData;
  }

  getProfile(idToken: string): UserProfile {
    return this.cache[idToken];
  }
}

export const profileClient = new LocalCacheProfileClient();
