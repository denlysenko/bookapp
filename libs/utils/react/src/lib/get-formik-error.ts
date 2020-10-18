import { FormikErrors, FormikTouched, getIn } from 'formik';

interface Args<T> {
  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
  apiErrors?: unknown;
}

export function getFormikError<T>(
  name: string,
  { touched, errors, apiErrors }: Args<T>
): string | undefined {
  const fieldTouched = getIn(touched, name);
  const apiError = getIn(apiErrors, name);
  const clientError = getIn(errors, name);

  if (clientError && fieldTouched) {
    return clientError;
  }

  if (apiError) {
    return apiError;
  }

  return undefined;
}
