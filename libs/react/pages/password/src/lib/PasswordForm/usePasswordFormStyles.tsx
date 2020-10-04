import { makeStyles } from '@material-ui/core/styles';

export const usePasswordFormStyles = makeStyles({
  form: {
    '& .MuiTextField-root': {
      width: '100%',
    },

    ['@media (max-width: 768px)']: {
      marginTop: '1rem',
    },

    '& .MuiCardActions-root': {
      justifyContent: 'flex-end',
      paddingRight: 0,
    },
  },
});
