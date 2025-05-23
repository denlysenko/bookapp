import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBookmarks = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 128px)',

  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 112px)',
  },

  '& .MuiToolbar-root': {
    background: '#eef1f7',
    padding: '0 16px',
    color: 'rgba(0,0,0,.87)',

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
