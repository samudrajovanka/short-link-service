import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

// Define the options interface for the constructor
interface AuthenticationErrorOptions {
  type?: string;
  statusCode?: number;
}

class AuthenticationError extends ClientError {
  name: string;

  constructor(
    message: string = ErrorConstant.message.AUTH_ERR_MSG,
    options?: AuthenticationErrorOptions
  ) {
    super(message, {
      type: options?.type ?? ErrorConstant.type.AUTHENTICATION_ERR,
      statusCode: options?.statusCode ?? 403,
    });

    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;
