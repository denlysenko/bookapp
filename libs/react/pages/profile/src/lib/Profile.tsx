import { useCallback, useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { useMe, useProfile } from '@bookapp/react/data-access';
import { useFeedback } from '@bookapp/react/ui';
import { User } from '@bookapp/shared/interfaces';

import AvatarSelector from './AvatarSelector/AvatarSelector';
import ProfileForm from './ProfileForm/ProfileForm';
import { StyledProfile } from './StyledProfile';

export const PROFILE_UPDATE_SUCCESS = 'Profile updated!';

export const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { me } = useMe();
  const { updateProfile } = useProfile();
  const { showFeedback } = useFeedback();

  const submitForm = useCallback(async (user: Partial<User>) => {
    setLoading(true);

    try {
      await updateProfile(me.id, user);
      setLoading(false);
      showFeedback(PROFILE_UPDATE_SUCCESS);
    } catch (errors) {
      setLoading(false);
      setError(errors[errors.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledProfile className="view-content">
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
    </StyledProfile>
  );
};

export default Profile;
