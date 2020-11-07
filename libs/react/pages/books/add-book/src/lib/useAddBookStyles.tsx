import { makeStyles } from '@material-ui/core/styles';

export const useAddBookStyles = makeStyles({
  root: {
    maxWidth: 780,
    height: 'calc(100% - 128px)',
    overflowY: 'auto',

    '& .MuiCardHeader-root': {
      paddingBottom: 0,
      marginBottom: 8,
    },

    '& .MuiCardContent-root': {
      paddingTop: 0,
    },
  },
});
