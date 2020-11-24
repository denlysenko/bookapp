import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useLastLogs, useMe } from '@bookapp/react/data-access';
import { categories, navs } from '@bookapp/shared/constants';
import { UserActionsDesc } from '@bookapp/shared/enums';
import { User } from '@bookapp/shared/interfaces';

import { useNavStyles } from './useNavStyles';

const isAdmin = (user: User) => user.roles.includes('admin');

export const Nav = () => {
  const classes = useNavStyles();
  const { me } = useMe();
  const { logs } = useLastLogs(me._id);

  return (
    <div className={classes.root}>
      <List component="nav" disablePadding={true}>
        {isAdmin(me) && (
          <NavLink to="/books/add" className={classes.listItem} activeClassName="active">
            <ListItem button={true}>
              <ListItemIcon>
                <Icon>add_circle</Icon>
              </ListItemIcon>
              <ListItemText>Add Book</ListItemText>
            </ListItem>
          </NavLink>
        )}
        <div className={classes.divider} />
        {navs.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={classes.listItem}
            activeClassName="active"
          >
            <ListItem button={true}>
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <div className={classes.divider} />
      <List component="nav" disablePadding={true}>
        {categories.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={classes.listItem}
            activeClassName="active"
          >
            <ListItem button={true}>
              <ListItemIcon>
                <Icon style={{ color: item.color }}>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <div className={classes.divider} />
      <List className="logs" component="ul" disablePadding={true}>
        {logs &&
          logs.map((log) => (
            <div key={log.createdAt} className={classes.listItem}>
              <ListItem>
                <ListItemIcon>
                  <Icon>access_time</Icon>
                </ListItemIcon>
                <ListItemText>
                  <p className={classes.action}>{UserActionsDesc[log.action]}</p>
                  <p className={classes.footnote}>
                    <span>{log.book.title}</span>
                    <br />
                    <span> by {log.book.author}</span>
                  </p>
                  <p className={classes.footnote}>{log.createdAt}</p>
                </ListItemText>
              </ListItem>
            </div>
          ))}
      </List>
    </div>
  );
};

export default memo(Nav);
