import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBookReader = styled(Box)(() => ({
  '& *': {
    boxSizing: 'content-box',
  },

  '@media only screen and (max-width: 550px)': {
    '.arrow': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100% - 56px)',
      top: 45,
      width: '10%',
      marginTop: 0,
      textIndent: 0,
    },
  },

  '@media only screen and (max-device-width: 375px) and (orientation: portrait)': {
    '#viewer': {
      height: 400,
    },
  },

  '@media only screen and (max-device-width: 320px) and (orientation: portrait)': {
    '#viewer': {
      height: 315,
    },
  },
}));
