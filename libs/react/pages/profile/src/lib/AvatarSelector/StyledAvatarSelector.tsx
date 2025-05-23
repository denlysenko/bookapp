import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledAvatarSelector = styled(Box)(() => ({
  '& .MuiCard-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '154px',
    marginBottom: '1rem',
    padding: '16px',

    '& img': {
      width: '150px',
      height: '150px',
    },
  },

  '& .MuiButton-root': {
    width: '100%',
    textTransform: 'uppercase',
  },
}));
