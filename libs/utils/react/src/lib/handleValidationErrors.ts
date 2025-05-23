import { FormikContextType, FormikErrors } from 'formik';

export function handleValidationError<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: { [key: string]: any },
  formik: FormikContextType<T>
) {
  const apiErrors = Object.values(errors).reduce<FormikErrors<T>>(
    (acc, { path, message }) => ({ ...acc, [path]: message }),
    {}
  );

  formik.setStatus({ apiErrors });
}
