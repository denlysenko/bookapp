export const formatError = err => {
  if (err.originalError && err.originalError.name === 'ValidationError') {
    return err.originalError;
  }
  return err;
};
