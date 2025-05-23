import React, { memo, useEffect } from 'react';

import { useFormik } from 'formik';
import { has, isEmpty, isNil, omit } from 'lodash';
import * as Yup from 'yup';

import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';

import { ERRORS } from '@bookapp/shared/constants';
import { User } from '@bookapp/shared/interfaces';
import { getFormikError, handleValidationError } from '@bookapp/utils/react';

import { StyledProfileForm } from './StyledProfileForm';

export interface ProfileFormProps {
  user: User;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  onSubmit: (user: Partial<User>) => void;
}

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required(ERRORS.REQUIRED_FIELD),
  lastName: Yup.string().required(ERRORS.REQUIRED_FIELD),
  email: Yup.string().email(ERRORS.INVALID_EMAIL).required(ERRORS.REQUIRED_FIELD),
});

export const ProfileForm = ({ user, loading, error, onSubmit }: ProfileFormProps) => {
  const formik = useFormik<Partial<User>>({
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    },
    initialStatus: {
      apiErrors: {},
    },
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      if (!isEmpty(formik.status.apiErrors)) {
        return;
      }

      onSubmit(values);
    },
  });

  useEffect(() => {
    if (!isNil(error)) {
      handleValidationError<Partial<User>>(error, formik);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const firstNameError = getFormikError<Partial<User>>('firstName', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const lastNameError = getFormikError<Partial<User>>('lastName', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const emailError = getFormikError<Partial<User>>('email', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;

    if (has(formik.status.apiErrors, name)) {
      formik.setStatus({
        apiErrors: omit(formik.status.apiErrors, name),
      });
    }

    formik.handleChange(event);
  };

  return (
    <StyledProfileForm noValidate={true} onSubmit={formik.handleSubmit}>
      <TextField
        name="firstName"
        label="First Name"
        variant="outlined"
        required={true}
        margin="normal"
        error={!!firstNameError}
        helperText={firstNameError}
        value={formik.values.firstName}
        onChange={handleChange}
      />
      <TextField
        name="lastName"
        label="Last Name"
        variant="outlined"
        required={true}
        margin="normal"
        error={!!lastNameError}
        helperText={lastNameError}
        value={formik.values.lastName}
        onChange={handleChange}
      />
      <TextField
        type="email"
        name="email"
        label="Email"
        variant="outlined"
        required={true}
        margin="normal"
        error={!!emailError}
        helperText={emailError}
        value={formik.values.email}
        onChange={handleChange}
      />
      <CardActions>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          data-testid="save"
        >
          Save
        </Button>
      </CardActions>
    </StyledProfileForm>
  );
};

export default memo(ProfileForm);
