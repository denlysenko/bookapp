import { makeStyles } from '@material-ui/core/styles';

export const useViewBookStyles = makeStyles({
  root: {
    height: 'calc(100% - 128px)',

    ['@media (max-width: 576px)']: {
      height: 'calc(100% - 112px)',
    },

    '& .MuiToolbar-root': {
      background: '#eef1f7',
      padding: '0 16px',
      color: 'rgba(0,0,0,.87)',

      '& .MuiTypography-body1': {
        fontSize: 20,
      },
    },

    '& .view-content': {
      maxWidth: 780,
      height: 'calc(100% - 64px)',
      overflowY: 'auto',

      ['@media (max-width: 576px)']: {
        height: 'calc(100% - 56px)',
      },
    },

    '& .MuiCard-root': {
      padding: 16,
    },
  },
});
