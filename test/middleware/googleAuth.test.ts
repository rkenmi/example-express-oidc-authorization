import { OAuth2Client } from 'google-auth-library';
import googleAuth from '../../src/middleware/googleAuth';
import { profileClient } from '../../src/services/profileClient';
import { HTTP_UNAUTHORIZED } from '../../src/constants/auth';

jest.mock('google-auth-library');

describe('google authentication handler', () => {
  let mockRequest: object;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
    };
  });

  it('adds profile for successful authorization', async () => {
    const mockToken = {
      getPayload: () => {
        return { email: 'foo', given_name: 'bar', picture: 'http://url/pic.png' };
      },
    };

    const oauth = new OAuth2Client();
    oauth.verifyIdToken.mockResolvedValue(mockToken);

    const mockFn = jest.fn(googleAuth);
    await mockFn(mockRequest, null, null);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(Object.keys(profileClient.cache).length).toBe(1);
    expect(mockRequest.body.profile).not.toBe(undefined);
  });

  it('throws error for invalid authorization', async () => {
    const oauth = new OAuth2Client();
    oauth.verifyIdToken.mockRejectedValue();

    const mockFn = jest.fn(googleAuth);
    try {
      await mockFn(mockRequest, null, null);
    } catch (e) {
      expect(e.provider).toBe('Google');
      expect(e.status).toBe(HTTP_UNAUTHORIZED);
      expect(e.message).toBe('Authentication Failure: Invalid token');
    }
  });
});
