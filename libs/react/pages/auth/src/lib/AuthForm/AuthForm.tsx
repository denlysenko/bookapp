import React, { useEffect, useRef, useState } from 'react';

import { useFormik } from 'formik';
import { has, isEmpty, omit } from 'lodash-es';
import * as Yup from 'yup';

import { useFeedback } from '@bookapp/react/ui';
import { ERRORS, errorsMap } from '@bookapp/shared/constants';
import { getFormikError, handleValidationError } from '@bookapp/utils/react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Icon from '@mui/material/Icon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';

import { StyledAuthForm } from './StyledAuthForm';

export interface AuthFormValues {
  firstName?: '';
  lastName?: '';
  email: '';
  password: '';
}

export interface AuthFormProps {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
  onSubmit: (isLoggingIn: boolean, values: AuthFormValues) => void;
  onLoginWithPasskey: () => void;
}

const AuthSchema = Yup.object().shape({
  email: Yup.string().email(ERRORS.INVALID_EMAIL).required(ERRORS.REQUIRED_FIELD),
  password: Yup.string().required(ERRORS.REQUIRED_FIELD),
});

export const AuthForm = ({ loading, onSubmit, error, onLoginWithPasskey }: AuthFormProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const { showFeedback } = useFeedback();
  const anchorRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<AuthFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    initialStatus: {
      apiErrors: {},
    },
    validationSchema: AuthSchema,
    onSubmit: (values) => {
      if (!isEmpty(formik.status.apiErrors)) {
        return;
      }

      let formValues = { ...values };

      if (isLoggingIn) {
        const { firstName, lastName, ...rest } = values;
        formValues = rest;
      }

      onSubmit(isLoggingIn, formValues);
    },
  });

  useEffect(() => {
    formik.setErrors({});
    formik.setStatus({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggingIn]);

  useEffect(() => {
    if (!isLoggingIn) {
      formik.registerField('firstName', {
        validate: (value: string) => (!value ? ERRORS.REQUIRED_FIELD : undefined),
      });

      formik.registerField('lastName', {
        validate: (value: string) => (!value ? ERRORS.REQUIRED_FIELD : undefined),
      });
    } else {
      formik.unregisterField('firstName');
      formik.unregisterField('lastName');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggingIn]);

  useEffect(() => {
    if (error) {
      if (error.message) {
        showFeedback(errorsMap[error.message] ?? error.message);
      } else {
        handleValidationError<AuthFormValues>(error, formik);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const emailError = getFormikError<AuthFormValues>('email', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const passwordError = getFormikError<AuthFormValues>('password', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const firstNameError = getFormikError<AuthFormValues>('firstName', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const lastNameError = getFormikError<AuthFormValues>('lastName', {
    touched: formik.touched,
    errors: formik.errors,
    apiErrors: formik.status.apiErrors,
  });

  const toggleAuthMode = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;

    if (has(formik.status.apiErrors, name)) {
      formik.setStatus({
        apiErrors: omit(formik.status.apiErrors, name),
      });
    }

    formik.handleChange(event);
  };

  const handleToggle = () => {
    setLoginMenuOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setLoginMenuOpen(false);
  };

  return (
    <StyledAuthForm>
      <div className="auth-form">
        <Card>
          <form noValidate={true} onSubmit={formik.handleSubmit}>
            <CardHeader
              className="auth-header"
              title={isLoggingIn ? 'Login into account' : 'Create account'}
              slotProps={{
                title: { align: 'center', variant: 'h6' },
              }}
              data-testid="title"
            />
            <CardContent>
              {!isLoggingIn && (
                <TextField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                  className="form-field"
                  required={true}
                  error={!!firstNameError}
                  helperText={firstNameError}
                  value={formik.values.firstName}
                  onChange={handleChange}
                />
              )}
              {!isLoggingIn && (
                <TextField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                  className="form-field"
                  required={true}
                  error={!!lastNameError}
                  helperText={lastNameError}
                  value={formik.values.lastName}
                  onChange={handleChange}
                />
              )}
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                className="form-field"
                required={true}
                error={!!emailError}
                helperText={emailError}
                value={formik.values.email}
                onChange={handleChange}
              />
              <TextField
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                margin="normal"
                className="form-field"
                required={true}
                error={!!passwordError}
                helperText={passwordError}
                value={formik.values.password}
                onChange={handleChange}
              />
            </CardContent>
            <CardActions className="form-actions">
              <span>{isLoggingIn ? "Don't have an account?" : 'Already have an account?'}</span>
              <Button
                type="button"
                className="button"
                disabled={loading}
                onClick={toggleAuthMode}
                data-testid="toggle"
              >
                {isLoggingIn ? 'Create one' : 'Back to Login'}
              </Button>
              {isLoggingIn ? (
                <>
                  <ButtonGroup
                    variant="contained"
                    ref={anchorRef}
                    className="button"
                    disabled={loading}
                  >
                    <Button type="submit" color="primary" data-testid="submit">
                      Login
                    </Button>
                    <Button onClick={handleToggle} data-testid="login-menu">
                      <Icon>arrow_drop_down</Icon>
                    </Button>
                  </ButtonGroup>
                  <Popper
                    sx={{ zIndex: 1 }}
                    open={loginMenuOpen}
                    anchorEl={anchorRef.current}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem>
                              <MenuItem
                                onClick={() => {
                                  onLoginWithPasskey();
                                  setLoginMenuOpen(false);
                                }}
                              >
                                Login with Passkey
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              ) : (
                <Button
                  type="submit"
                  className="button"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  data-testid="submit"
                >
                  Create
                </Button>
              )}
            </CardActions>
          </form>
        </Card>
      </div>
    </StyledAuthForm>
  );
};

export default AuthForm;
