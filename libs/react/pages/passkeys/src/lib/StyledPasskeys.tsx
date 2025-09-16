import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledPasskeys = styled(Box)(() => ({
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
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  '.MuiCardActions-root': {
    padding: 16,
  },
}));
