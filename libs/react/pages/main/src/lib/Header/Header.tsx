import React, { memo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import { useColorScheme } from '@mui/material/styles';

import { useAuth, useMe } from '@bookapp/react/data-access';
import { userMenu } from '@bookapp/shared/constants';

import { StyledHeader } from './StyledHeader';

export interface HeaderProps {
  toggleDrawer: () => void;
}

export const Header = ({ toggleDrawer }: HeaderProps) => {
  const { me } = useMe();
  const { logout } = useAuth();
  const { mode, setMode } = useColorScheme();
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState<null | HTMLElement>(null);

  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const closeUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const openThemeMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const closeThemeMenu = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleLogoutClick = () => {
    closeUserMenu();
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
            <IconButton id="theme-switcher" className="theme-switcher" onClick={openThemeMenu}>
              <Icon>
                {mode === 'system'
                  ? 'brightness_medium'
                  : mode === 'light'
                    ? 'light_mode'
                    : 'dark_mode'}
              </Icon>
            </IconButton>
            <Menu
              className="menu"
              anchorEl={themeMenuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(themeMenuAnchorEl)}
              onClose={closeThemeMenu}
            >
              <MenuItem
                onClick={() => {
                  setMode('system');
                  closeThemeMenu();
                }}
              >
                System
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMode('light');
                  closeThemeMenu();
                }}
              >
                Light
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMode('dark');
                  closeThemeMenu();
                }}
              >
                Dark
              </MenuItem>
            </Menu>

            <Button
              id="user-menu"
              className="user-menu-toggler"
              onClick={openUserMenu}
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
              anchorEl={userMenuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(userMenuAnchorEl)}
              onClose={closeUserMenu}
            >
              {[...userMenu, { label: 'Passkeys', path: 'passkeys' }].map((item) => (
                <NavLink key={item.path} to={item.path} className="link">
                  <MenuItem onClick={closeUserMenu}>{item.label}</MenuItem>
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
