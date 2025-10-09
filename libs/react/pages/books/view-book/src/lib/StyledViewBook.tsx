import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledViewBook = styled(Box)(() => ({
  height: 'calc(100vh - 128px)',

  '@media (max-width: 576px)': {
    height: 'calc(100vh - 112px)',
  },

  '& .MuiToolbar-root': {
    backgroundColor: 'light-dark(#eef1f7, #1e2538)',
    padding: '0 16px',
    color: 'light-dark(rgba(0, 0, 0, 0.87), rgb(226, 226, 226))',

    '& .MuiTypography-body1': {
      fontSize: '20px',
    },
  },

  '& .view-content': {
    maxWidth: '780px',
    height: 'calc(100% - 64px)',
    overflowY: 'auto',

    '@media (max-width: 576px)': {
      height: 'calc(100% - 56px)',
    },
  },

  '& .MuiCard-root': {
    padding: '16px',
  },
}));
