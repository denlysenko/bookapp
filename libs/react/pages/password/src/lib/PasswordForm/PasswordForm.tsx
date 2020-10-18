import React from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import { ERRORS } from '@bookapp/shared/constants';
import { PasswordForm as PasswordFormValues } from '@bookapp/shared/interfaces';
import { getFormikError } from '@bookapp/utils/react';

import { usePasswordFormStyles } from './usePasswordFormStyles';

export interface PasswordFormProps {
  loading: boolean;
  onSubmit: (values: PasswordFormValues) => void;
}

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required(ERRORS.REQUIRED_FIELD),
  password: Yup.string().required(ERRORS.REQUIRED_FIELD),
});

export const PasswordForm = ({ loading, onSubmit }: PasswordFormProps) => {
  const classes = usePasswordFormStyles();

  const formik = useFormik<PasswordFormValues>({
    initialValues: {
      oldPassword: '',
      password: '',
    },
    validationSchema: PasswordSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const oldPasswordError = getFormikError<PasswordFormValues>('oldPassword', {
    touched: formik.touched,
    errors: formik.errors,
  });

  const passwordError = getFormikError<PasswordFormValues>('password', {
    touched: formik.touched,
    errors: formik.errors,
  });

  return (
    <form className={classes.form} noValidate={true} onSubmit={formik.handleSubmit}>
      <TextField
        type="password"
        name="oldPassword"
        label="Current Password"
        variant="outlined"
        required={true}
        margin="normal"
        error={!!oldPasswordError}
        helperText={oldPasswordError}
        value={formik.values.oldPassword}
        onChange={formik.handleChange}
      />
      <TextField
        type="password"
        name="password"
        label="New Password"
        variant="outlined"
        required={true}
        margin="normal"
        error={!!passwordError}
        helperText={passwordError}
        value={formik.values.password}
        onChange={formik.handleChange}
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
    </form>
  );
};

export default PasswordForm;
