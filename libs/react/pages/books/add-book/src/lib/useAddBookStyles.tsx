import { makeStyles } from '@material-ui/core/styles';

export const useAddBookStyles = makeStyles({
  root: {
    maxWidth: 780,
    height: 'calc(100vh - 128px)',
    overflowY: 'auto',

    ['@media (max-width: 576px)']: {
      height: 'calc(100vh - 112px)',
    },

    '& .MuiCardHeader-root': {
      paddingBottom: 0,
      marginBottom: 8,
    },

    '& .MuiCardContent-root': {
      paddingTop: 0,
    },
  },
});
