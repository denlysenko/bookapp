import { makeStyles } from '@material-ui/core/styles';

export const usePasswordStyles = makeStyles({
  root: {
    maxWidth: 600,
    height: 'calc(100% - 128px)',
    overflowY: 'auto',

    ['@media (max-width: 576px)']: {
      height: 'calc(100% - 112px)',
    },

    '& .MuiCardHeader-root': {
      paddingBottom: 0,
    },

    '& .MuiCardContent-root': {
      paddingTop: 0,
    },
  },
});
