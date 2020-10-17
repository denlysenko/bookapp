import { makeStyles } from '@material-ui/core/styles';

export const useProfileFormStyles = makeStyles({
  form: {
    '& .MuiTextField-root': {
      width: '100%',

      '&:first-of-type': {
        marginTop: 0,
      },
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
