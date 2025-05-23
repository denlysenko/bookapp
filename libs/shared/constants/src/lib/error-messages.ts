export enum ERRORS {
  REQUIRED_FIELD = 'This field is required',
  INVALID_EMAIL = 'Not a valid email',
}

export const errorsMap: Record<string, string> = {
  INCORRECT_EMAIL_OR_PASSWORD_ERR: 'Incorrect email or password.',
  EMAIL_IN_USE_ERR: 'Email is already in use.',
  PASSWORD_LENGTH_ERR: 'Password must be at least 6 characters long.',
  OLD_PASSWORD_MATCH_ERR: 'Old password is incorrect.',
  INVALID_IMG_ERR: 'Invalid image format.',
};
