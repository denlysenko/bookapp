import { styled } from '@mui/material/styles';

export const StyledPasskey = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 1fr auto',
  gap: 8,

  '& .passkey-icon': {
    width: 24,
    height: 24,
  },

  '& .passkey-info': {
    '& .header': {
      fontSize: 16,
    },

    '& .cell': {
      fontSize: 14,
    },
  },
}));
