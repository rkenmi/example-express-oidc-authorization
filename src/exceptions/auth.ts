class AuthException extends Error {
  provider?: string;
  status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

export default AuthException;
