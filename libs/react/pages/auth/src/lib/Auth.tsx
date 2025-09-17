import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@bookapp/react/data-access';
import { useFeedback } from '@bookapp/react/ui';
import { SignupCredentials } from '@bookapp/shared/interfaces';

import AuthForm, { AuthFormValues } from './AuthForm/AuthForm';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, loginWithPasskey, signup } = useAuth();
  const { showFeedback } = useFeedback();
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

  const onLoginWithPasskey = async () => {
    setLoading(true);

    try {
      const result = await loginWithPasskey();

      if (result) {
        navigate('/');
      }
    } catch {
      setLoading(false);
      showFeedback('Error authenticating passkey');
    }
  };

  return (
    <AuthForm
      loading={loading}
      onSubmit={submitForm}
      error={error}
      onLoginWithPasskey={onLoginWithPasskey}
    />
  );
};

export default Auth;
