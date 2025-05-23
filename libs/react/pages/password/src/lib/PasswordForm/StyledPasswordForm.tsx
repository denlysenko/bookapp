import { styled } from '@mui/material/styles';

export const StyledPasswordForm = styled('form')(() => ({
  '.MuiTextField-root': {
    width: '100%',
  },

  '@media (max-width: 768px)': {
    marginTop: '1rem',
  },

  '.MuiCardActions-root': {
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
}));
