import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBrowseBooks = styled(Box)(() => ({
  height: 'calc(100vh - 128px)',

  '@media (max-width: 576px)': {
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

    '@media (max-width: 768px)': {
      height: 'calc(100% - 187px)',
    },

    '@media (max-width: 576px)': {
      height: 'calc(100% - 155px)',
    },
  },
}));
