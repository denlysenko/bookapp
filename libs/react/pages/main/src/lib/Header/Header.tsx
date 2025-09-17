import React, { memo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';

import { useAuth, useMe } from '@bookapp/react/data-access';
import { userMenu } from '@bookapp/shared/constants';

import { StyledHeader } from './StyledHeader';

export interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
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
    <StyledHeader color="primary" position="fixed">
      <Toolbar>
        <IconButton
          className="menu-toggler"
          onClick={toggleDrawer}
          data-testid="toggle-menu"
          size="large"
        >
          <Icon>menu</Icon>
        </IconButton>
        <Link to="/" className="brand">
          <Icon>book</Icon>
          <span>Book App</span>
        </Link>
        {me && (
          <div className="user-menu">
            <Button
              id="user-menu"
              className="user-menu-toggler"
              onClick={handleClick}
              endIcon={<Icon>expand_more</Icon>}
            >
              <img
                src={me.avatar ? me.avatar : '/images/no-avatar.svg'}
                className="avatar"
                alt="avatar"
              />
              {me.displayName}
            </Button>
            <Menu
              className="menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {[...userMenu, { label: 'Passkeys', path: 'passkeys' }].map((item) => (
                <NavLink key={item.path} to={item.path} className="link">
                  <MenuItem onClick={handleClose}>{item.label}</MenuItem>
                </NavLink>
              ))}
              <Divider />
              <div className="link">
                <MenuItem onClick={handleLogoutClick}>Signout</MenuItem>
              </div>
            </Menu>
          </div>
        )}
      </Toolbar>
    </StyledHeader>
  );
};

export default memo(Header);
