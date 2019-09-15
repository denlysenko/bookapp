import { formatError } from './format-error';

describe('formatError', () => {
  it('should return array of original errors', () => {
    expect(
      formatError({
        originalError: {
          name: 'ValidationError',
          errors: [
            {
              email: {
                message: 'EMAIL_INVALID_ERR',
                name: 'ValidatorError'
              },
              password: {
                message: 'PASSWORD_LENGTH_ERR',
                name: 'ValidatorError'
              }
            }
          ]
        }
      })
    ).toEqual([
      {
        email: {
          message: 'EMAIL_INVALID_ERR',
          name: 'ValidatorError'
        },
        password: {
          message: 'PASSWORD_LENGTH_ERR',
          name: 'ValidatorError'
        }
      }
    ]);
  });

  it('should return error without changes', () => {
    expect(formatError({ message: 'Error' })).toEqual({ message: 'Error' });
  });
});
