import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from '../../src/constants/auth';
import facebookAuth, { FacebookAuthException } from '../../src/middleware/fbAuth';
import googleAuth, { GoogleAuthException } from '../../src/middleware/googleAuth';
import authMiddleware from '../../src/middleware/authMiddleware';
import { hasBearerTokenInHeaders, UserProfile } from '../../src/helpers/auth';

jest.mock('../../src/middleware/googleAuth');
jest.mock('../../src/middleware/fbAuth');
jest.mock('../../src/helpers/auth');

describe('authentication middleware', () => {
  let mockRequest: object;
  let mockResponse: object;
  let mockDoneFn: object;

  class MockResponse {
    public statusNumber: number;
    public ended: boolean;
    public message: string;

    status(code: number) {
      this.statusNumber = code;
      return this;
    }

    send(message: string) {
      this.message = message;
      return this;
    }

    end() {
      this.ended = true;
    }
  }

  beforeEach(() => {
    mockRequest = {
      body: {},
      headers: {
      },
    };
    mockResponse = new MockResponse();
    mockDoneFn = jest.fn();
  });

  it('adds profile for successful authorization', async () => {
    const mockFn = jest.fn(authMiddleware);
    hasBearerTokenInHeaders.mockReturnValue(true);
    googleAuth.mockImplementation(() => {
      mockRequest.body.profile = new UserProfile('foo', 'bar', 'bash');
    });
    await mockFn(mockRequest, mockResponse, mockDoneFn);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockDoneFn.mock.calls.length).toBe(1);
    expect(mockRequest.body.profile).not.toBe(undefined);
  });

  it('sets http response status to bad request if headers are invalid', async () => {
    const mockFn = jest.fn(authMiddleware);
    hasBearerTokenInHeaders.mockReturnValue(false);
    await mockFn(mockRequest, mockResponse, mockDoneFn);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockDoneFn.mock.calls.length).toBe(0);
    expect(mockRequest.body.profile).toBe(undefined);
    expect(mockResponse.statusNumber).toBe(HTTP_BAD_REQUEST);
  });

  it('sets http response status to unauthorized if authorization handlers fail', async () => {
    const mockFn = jest.fn(authMiddleware);
    hasBearerTokenInHeaders.mockReturnValue(true);
    googleAuth.mockRejectedValue(new GoogleAuthException(500, undefined));
    facebookAuth.mockRejectedValue(new FacebookAuthException(500, undefined));
    await mockFn(mockRequest, mockResponse, mockDoneFn);
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockDoneFn.mock.calls.length).toBe(0);
    expect(mockRequest.body.profile).toBe(undefined);
    expect(mockResponse.statusNumber).toBe(HTTP_UNAUTHORIZED);
  });
});
