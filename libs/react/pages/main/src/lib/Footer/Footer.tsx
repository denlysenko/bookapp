import { memo } from 'react';

import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

import { StyledFooter } from './StyledFooter';

export const Footer = () => (
  <StyledFooter position="fixed" color="primary">
    <Toolbar>
      <IconButton size="large">
        <Icon>help</Icon>
      </IconButton>
      <IconButton size="large">
        <Icon>settings</Icon>
      </IconButton>
    </Toolbar>
  </StyledFooter>
);

export default memo(Footer);
