import { memo } from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useLastLogs, useMe } from '@bookapp/react/data-access';
import { categories, navs } from '@bookapp/shared/constants';
import { UserActionsDesc } from '@bookapp/shared/enums';
import { User } from '@bookapp/shared/interfaces';
import { dateToPeriod } from '@bookapp/utils/react';

import { StyledNav } from './StyledNav';

const isAdmin = (user: User) => user.roles.includes('admin');

export const Nav = () => {
  const { me } = useMe();
  const { logs } = useLastLogs(me.id);

  return (
    <StyledNav>
      <List component="nav">
        {isAdmin(me) && (
          <NavLink to="/books/add" className="list-item">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon>add_circle</Icon>
                </ListItemIcon>
                <ListItemText>Add Book</ListItemText>
              </ListItemButton>
            </ListItem>
          </NavLink>
        )}
        <div className="divider" />
        {navs.map((item) => (
          <NavLink key={item.path} to={item.path} className="list-item">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <div className="divider" />
      <List component="nav">
        {categories.map((item) => (
          <NavLink key={item.path} to={item.path} className="list-item">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon style={{ color: item.color }}>{item.icon}</Icon>
                </ListItemIcon>
                <ListItemText>{item.label}</ListItemText>
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <div className="divider" />
      <List className="logs" component="ul">
        {logs &&
          logs.map((log) => (
            <div key={log.createdAt} className="list-item">
              <ListItem>
                <ListItemIcon>
                  <Icon>access_time</Icon>
                </ListItemIcon>
                <ListItemText>
                  <p className="action">{UserActionsDesc[log.action]}</p>
                  <p className="footnote">
                    <span>{log.book.title}</span>
                    <br />
                    <span> by {log.book.author}</span>
                  </p>
                  <p className="footnote">{dateToPeriod(log.createdAt)}</p>
                </ListItemText>
              </ListItem>
            </div>
          ))}
      </List>
    </StyledNav>
  );
};

export default memo(Nav);
