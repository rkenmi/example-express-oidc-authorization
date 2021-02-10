import { profileClient } from '../../src/services/profileClient';
import { HTTP_UNAUTHORIZED } from '../../src/constants/auth';
import facebookAuth from '../../src/middleware/fbAuth';

jest.mock('axios');
const axios = require('axios');

describe('facebook authentication handler', () => {
  let mockRequest: object;

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {},
    };
  });

  it('adds profile for successful authorization', async () => {
    const mockResponseData = {
      data: {
        email: 'foo',
        picture: {
          data: {
            url: 'avatar.png',
          },
        },
        first_name: 'bar',
      },
    };

    axios.mockResolvedValue(mockResponseData);

    const mockFn = jest.fn(facebookAuth);
    await mockFn(mockRequest, null, null);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(Object.keys(profileClient.cache).length).toBe(1);
    expect(mockRequest.body.profile).not.toBe(undefined);
  });

  it('throws error for invalid authorization', async () => {
    axios.mockRejectedValue();

    const mockFn = jest.fn(facebookAuth);
    try {
      await mockFn(mockRequest, null, null);
    } catch (e) {
      expect(e.provider).toBe('Facebook');
      expect(e.status).toBe(HTTP_UNAUTHORIZED);
      expect(e.message).toBe('Authentication Failure: Invalid token');
    }
  });
});
