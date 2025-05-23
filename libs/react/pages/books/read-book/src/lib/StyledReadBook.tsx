import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledReadBook = styled(Box)(() => ({
  position: 'relative',
  height: 'calc(100vh - 128px)',

  '@media (max-width: 576px)': {
    height: 'calc(100vh - 112px)',
  },
}));
