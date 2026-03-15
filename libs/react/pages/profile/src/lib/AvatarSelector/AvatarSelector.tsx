import { memo } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import { ImageSelector, useImageSelector } from '@bookapp/react/ui';
import { UPLOAD_FOLDERS } from '@bookapp/shared/constants';
import { User } from '@bookapp/shared/interfaces';

import { StyledAvatarSelector } from './StyledAvatarSelector';

export interface AvatarSelectorProps {
  user: User;
  onSave: (user: Partial<User>) => void;
}

export const AvatarSelector = ({ user, onSave }: AvatarSelectorProps) => {
  const { isImageSelectorOpened, showImageSelector, hideImageSelector } = useImageSelector();

  const onAvatarUpload = (publicUrl: string) => {
    onSave({ avatar: publicUrl });
  };

  return (
    <StyledAvatarSelector>
      <Card>
        <img
          src={user.avatar ? user.avatar : '/images/no-avatar.svg'}
          alt="avatar"
          data-testid="avatar"
        />
      </Card>
      <Button
        variant="contained"
        color="primary"
        onClick={showImageSelector}
        data-testid="showSelector"
      >
        Change Avatar
      </Button>
      <ImageSelector
        open={isImageSelectorOpened}
        onImageUpload={onAvatarUpload}
        onClose={hideImageSelector}
        folder={UPLOAD_FOLDERS.AVATARS}
      />
    </StyledAvatarSelector>
  );
};

export default memo(AvatarSelector);
