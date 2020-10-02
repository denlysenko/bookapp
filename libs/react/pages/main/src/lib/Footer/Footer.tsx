import React, { memo } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import { useFooterStyles } from './useFooterStyles';

export const Footer = () => {
  const classes = useFooterStyles();

  return (
    <AppBar className={classes.appBar} position="fixed" color="primary">
      <Toolbar className={classes.footer}>
        <IconButton>
          <Icon>help</Icon>
        </IconButton>
        <IconButton>
          <Icon>settings</Icon>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default memo(Footer);
