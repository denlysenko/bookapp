import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledHistory = styled(Box)(() => ({
  height: 'calc(100vh - 128px)',

  '@media (max-width: 576px)': {
    height: 'calc(100vh - 112px)',
  },

  '.MuiToolbar-root': {
    background: 'light-dark(#eef1f7, #1e2538)',
    padding: '0 16px',
    color: 'light-dark(rgba(0, 0, 0, 0.87), rgb(226, 226, 226))',

    '.MuiTypography-body1': {
      fontSize: '20px',
    },
  },

  '.view-content': {
    maxWidth: '960px',
    height: 'calc(100% - 64px)',
    overflowY: 'auto',

    '@media (max-width: 576px)': {
      height: 'calc(100% - 56px)',
    },

    '.MuiTablePagination-toolbar': {
      backgroundColor: 'var(--mui-palette-background-paper)',
      backgroundImage: 'var(--Paper-overlay)',
    },
  },
}));
