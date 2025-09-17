import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '&.MuiDialog-root': {
    zIndex: `${theme.zIndex.modal + 1} !important`,
  },

  '& .MuiDialog-paper': {
    width: 300,
    margin: 0,
    padding: 24,
  },

  '& .MuiDialogTitle-root': {
    padding: 0,
  },

  '& .MuiDialogContent-root': {
    padding: '12px 0',
  },

  '& .MuiFormControl-root': {
    width: '100%',
  },

  '& .MuiDialogActions-root': {
    marginBottom: -24,
    paddingLeft: 0,
    paddingRight: 0,
  },
}));
