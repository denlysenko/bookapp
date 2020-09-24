import { FormikContextType, FormikErrors } from 'formik';

export function handleValidationError<T>(
  errors: { [key: string]: any },
  formik: FormikContextType<T>
) {
  const apiErrors = Object.values(errors).reduce<FormikErrors<T>>(
    (acc, { path, message }) => ({ ...acc, [path]: message }),
    {}
  );

  formik.setStatus({ apiErrors });
}
