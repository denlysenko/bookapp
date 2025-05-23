import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

export const StyledFooter = styled(AppBar)(({ theme }) => ({
  top: 'auto',
  bottom: 0,
  zIndex: theme.zIndex.modal + 1,
  '& .MuiToolbar-root': {
    justifyContent: 'flex-end',
  },
}));
