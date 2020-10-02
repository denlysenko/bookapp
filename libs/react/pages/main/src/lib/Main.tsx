import React, { useCallback, useState } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Footer from './Footer/Footer';
import Header from './Header/Header';
import Nav from './Nav/Nav';
import { useMainStyles } from './useMainStyles';

export const Main = () => {
  const classes = useMainStyles();
  const matches = useMediaQuery('(min-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
  }, []);

  const handleBackDropClick = () => {
    setDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <Header toggleDrawer={toggleDrawer} />
      <Drawer
        className={classes.drawer}
        variant={matches ? 'permanent' : 'temporary'}
        open={drawerOpen}
        ModalProps={{
          BackdropProps: {
            onClick: handleBackDropClick,
          },
        }}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <Nav />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        Main Page
      </main>
      <Footer />
    </div>
  );
};

export default Main;
