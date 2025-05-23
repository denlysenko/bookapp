import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledAddBook = styled(Box)(() => ({
  maxWidth: 780,
  height: 'calc(100vh - 128px)',
  overflowY: 'auto',

  '@media (max-width: 576px)': {
    height: 'calc(100vh - 112px)',
  },

  '& .MuiCardHeader-root': {
    paddingBottom: 0,
    marginBottom: 8,
  },

  '& .MuiCardContent-root': {
    paddingTop: 0,
  },
}));
