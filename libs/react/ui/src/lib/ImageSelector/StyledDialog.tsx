import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  zIndex: `${theme.zIndex.modal + 1} !important`,

  '& #file': {
    display: 'none',
  },

  '& .MuiDialog-paper': {
    width: 300,
    margin: 0,
    padding: 24,
  },

  '& .MuiDialogTitle-root': {
    marginBottom: 20,
    padding: 0,
  },

  '& .progress': {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(238, 238, 238, 0.7)',
    zIndex: 3,

    '& .MuiLinearProgress-root': {
      width: '80%',
    },
  },

  '& .dropzone': {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 154,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,

    '& *:not(label)': {
      pointerEvents: 'none',
    },

    '& .material-icons': {
      fontSize: 100,
      color: 'rgba(156,165,185,.6)',
    },

    '&.highlighted': {
      border: '2px solid rgba(156,165,185,.6)',
    },

    '& .error': {
      color: '#f44336',
    },
  },

  '& .MuiDialogActions-root': {
    justifyContent: 'center',
    marginBottom: -24,
  },
}));
