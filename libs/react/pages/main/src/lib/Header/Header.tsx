import React, { memo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';

import { useAuth, useMe } from '@bookapp/react/data-access';
import { userMenu } from '@bookapp/shared/constants';

import { useHeaderStyles } from './useHeaderStyles';

export interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  const classes = useHeaderStyles();
  const { me } = useMe();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar className={classes.appBar} color="primary" position="fixed">
      <Toolbar>
        <IconButton
          className={classes.menuToggler}
          onClick={toggleDrawer}
          data-testid="toggle-menu"
        >
          <Icon>menu</Icon>
        </IconButton>
        <Link to="/" className={classes.brand}>
          <Icon>book</Icon>
          <span>Book App</span>
        </Link>
        {me && (
          <div className={classes.userMenu}>
            <Button id="user-menu" className={classes.userMenuToggler} onClick={handleClick}>
              <img
                src={me.avatar ? me.avatar : '/assets/images/no-avatar.svg'}
                className={classes.avatar}
                alt="avatar"
              />
              {me.displayName}
              <Icon>expand_more</Icon>
            </Button>
            <Menu
              className={classes.menu}
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {userMenu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={classes.link}
                  activeClassName="active"
                >
                  <MenuItem onClick={handleClose}>{item.label}</MenuItem>
                </NavLink>
              ))}
              <Divider />
              <div className={classes.link}>
                <MenuItem onClick={handleLogoutClick}>Signout</MenuItem>
              </div>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default memo(Header);
