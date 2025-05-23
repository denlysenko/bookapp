import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { GlobalStyles } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';

import Footer from './Footer/Footer';
import Header from './Header/Header';
import Nav from './Nav/Nav';
import { StyledMain } from './StyledMain';

export const Main = () => {
  const matches = useMediaQuery('(min-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!matches) {
      setDrawerOpen(false);
    }
  }, [location, matches]);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
  }, []);

  const handleBackDropClick = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          '.drawer': {
            width: 250,
            flexShrink: 0,
          },

          '.drawerPaper': {
            width: 250,
            backgroundColor: '#1f2637 !important',
          },

          '.drawerContainer': {
            height: 'calc(100% - 128px)',
            overflow: 'auto',
          },
        }}
      />
      <StyledMain>
        <Header toggleDrawer={toggleDrawer} />
        <Drawer
          className="drawer"
          variant={matches ? 'permanent' : 'temporary'}
          open={drawerOpen}
          ModalProps={{
            BackdropProps: {
              onClick: handleBackDropClick,
            },
          }}
          classes={{
            paper: 'drawerPaper',
          }}
        >
          <Toolbar />
          <div className="drawerContainer">
            <Nav />
          </div>
        </Drawer>
        <main className="content">
          <Toolbar />
          <Outlet />
        </main>
        <Footer />
      </StyledMain>
    </>
  );
};

export default Main;
