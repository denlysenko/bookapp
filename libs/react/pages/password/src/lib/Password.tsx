import { useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { usePassword } from '@bookapp/react/data-access';
import { useFeedback } from '@bookapp/react/ui';
import { PasswordForm as PasswordFormValues } from '@bookapp/shared/interfaces';

import { errorsMap } from '@bookapp/shared/constants';
import PasswordForm from './PasswordForm/PasswordForm';
import { StyledPassword } from './StyledPassword';

export const PASSWORD_CHANGE_SUCCESS = 'Password changed!';

export const Password = () => {
  const [loading, setLoading] = useState(false);
  const { showFeedback } = useFeedback();
  const { changePassword } = usePassword();

  const submitForm = async (values: PasswordFormValues) => {
    setLoading(true);

    try {
      await changePassword(values);
      setLoading(false);
      showFeedback(PASSWORD_CHANGE_SUCCESS);
    } catch (err) {
      setLoading(false);
      showFeedback(errorsMap[err[0].message] ?? err[0].message);
    }
  };

  return (
    <StyledPassword className="view-content">
      <Card>
        <CardHeader title="Change Password" />
        <CardContent>
          <PasswordForm loading={loading} onSubmit={submitForm} />
        </CardContent>
      </Card>
    </StyledPassword>
  );
};

export default Password;
