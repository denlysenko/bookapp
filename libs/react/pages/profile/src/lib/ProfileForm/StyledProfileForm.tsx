import { styled } from '@mui/material/styles';

export const StyledProfileForm = styled('form')(() => ({
  '& .MuiTextField-root': {
    width: '100%',

    '&:first-of-type': {
      marginTop: 0,
    },
  },

  '@media (max-width: 768px)': {
    marginTop: '1rem',
  },

  '& .MuiCardActions-root': {
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
}));
