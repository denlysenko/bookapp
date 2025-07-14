import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledProfile = styled(Box)(() => ({
  maxWidth: 780,
  height: 'calc(100vh - 128px)',
  overflowY: 'auto',

  '@media (max-width: 576px)': {
    height: 'calc(100vh - 112px)',
  },

  '& .MuiCardHeader-root': {
    paddingBottom: 8,
  },

  '& .MuiCardContent-root': {
    paddingTop: 0,
  },

  '& .profile-page': {
    display: 'flex',

    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },

    '& .avatar': {
      flexBasis: '25%',

      '@media (min-width: 768px)': {
        marginRight: '1.5rem',
      },
    },
  },
}));
