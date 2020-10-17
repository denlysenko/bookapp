import React, { useCallback, useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import { useMe, useProfile } from '@bookapp/react/data-access';
import { useFeedback } from '@bookapp/react/ui';
import { User } from '@bookapp/shared/interfaces';

import AvatarSelector from './AvatarSelector/AvatarSelector';
import ProfileForm from './ProfileForm/ProfileForm';
import { useProfileStyles } from './useProfileStyles';

export const PROFILE_UPDATE_SUCCESS = 'Profile updated!';

export const Profile = () => {
  const classes = useProfileStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { me } = useMe();
  const { updateProfile } = useProfile();
  const { showFeedback } = useFeedback();

  const submitForm = useCallback(async (user: Partial<User>) => {
    setLoading(true);

    try {
      await updateProfile(me._id, user);
      setLoading(false);
      showFeedback(PROFILE_UPDATE_SUCCESS);
    } catch (errors) {
      setLoading(false);
      setError(errors[errors.length - 1]);
    }
  }, []);

  return (
    <div className={`${classes.root} view-content`}>
      <Card>
        <CardHeader title="Edit Profile" />
        <CardContent className="profile-page">
          <div className="avatar">
            <AvatarSelector user={me} onSave={submitForm} />
          </div>
          <div className="profile">
            <ProfileForm user={me} loading={loading} error={error} onSubmit={submitForm} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
