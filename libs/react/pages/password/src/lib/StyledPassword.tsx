import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledPassword = styled(Box)(() => ({
  maxWidth: '600px',
  height: 'calc(100vh - 128px)',
  overflowY: 'auto',

  '@media (max-width: 576px)': {
    height: 'calc(100% - 112px)',
  },

  '.MuiCardHeader-root': {
    paddingBottom: 0,
  },

  '.MuiCardContent-root': {
    paddingTop: 0,
  },
}));
