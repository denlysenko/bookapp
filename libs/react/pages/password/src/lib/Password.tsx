import React, { useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { usePassword } from '@bookapp/react/data-access';
import { useFeedback } from '@bookapp/react/ui';
import { PasswordForm as PasswordFormValues } from '@bookapp/shared/interfaces';

import PasswordForm from './PasswordForm/PasswordForm';
import { usePasswordStyles } from './usePasswordStyles';

export const PASSWORD_CHANGE_SUCCESS = 'Password changed!';

export const Password = () => {
  const classes = usePasswordStyles();
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
      showFeedback(err[0].message);
    }
  };

  return (
    <div className={`${classes.root} view-content`}>
      <Card>
        <CardHeader title="Change Password" />
        <CardContent>
          <PasswordForm loading={loading} onSubmit={submitForm} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Password;
