import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@bookapp/react/data-access';
import { SignupCredentials } from '@bookapp/shared/interfaces';

import AuthForm, { AuthFormValues } from './AuthForm/AuthForm';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const submitForm = async (isLoggingIn: boolean, values: AuthFormValues) => {
    setLoading(true);

    try {
      const result = await (isLoggingIn
        ? login(values.email, values.password)
        : signup(values as SignupCredentials));

      if (result) {
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err[0]);
    }
  };

  return <AuthForm loading={loading} onSubmit={submitForm} error={error} />;
};

export default Auth;
