import React, { memo } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

import { User } from '@bookapp/shared/interfaces';
import { ImageSelector, useImageSelector } from '@bookapp/react/ui';

import { useAvatarSelectorStyles } from './useAvatarSelectorStyles';

export interface AvatarSelectorProps {
  user: User;
  onSave: (user: Partial<User>) => void;
}

export const AvatarSelector = ({ user, onSave }: AvatarSelectorProps) => {
  const classes = useAvatarSelectorStyles();
  const { isImageSelectorOpened, showImageSelector, hideImageSelector } = useImageSelector();

  const onAvatarUpload = (publicUrl: string) => {
    onSave({ avatar: publicUrl });
  };

  return (
    <div className={classes.root}>
      <Card>
        <img
          src={user.avatar ? user.avatar : '/assets/images/no-avatar.svg'}
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
      />
    </div>
  );
};

export default memo(AvatarSelector);
