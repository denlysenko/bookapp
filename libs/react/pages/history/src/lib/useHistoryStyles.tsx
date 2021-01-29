import { makeStyles } from '@material-ui/core/styles';

export const useHistoryStyles = makeStyles({
  root: {
    height: 'calc(100vh - 128px)',

    ['@media (max-width: 576px)']: {
      height: 'calc(100vh - 112px)',
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
      maxWidth: 960,
      height: 'calc(100% - 64px)',
      overflowY: 'auto',

      ['@media (max-width: 576px)']: {
        height: 'calc(100% - 56px)',
      },

      '& .MuiTablePagination-toolbar': {
        background: '#ffffff',
      },
    },
  },
});
