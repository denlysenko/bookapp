import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBookmarks = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 128px)',

  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 112px)',
  },

  '& .MuiToolbar-root': {
    background: 'light-dark(#eef1f7, #1e2538)',
    padding: '0 16px',
    color: 'light-dark(rgba(0,0,0,.87), rgb(226, 226, 226))',

    '& .MuiTypography-body1': {
      fontSize: 20,
    },
  },

  '& .view-content': {
    height: 'calc(100% - 128px)',
    overflowY: 'auto',

    [theme.breakpoints.down('md')]: {
      height: 'calc(100% - 187px)',
    },

    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 155px)',
    },
  },
}));
