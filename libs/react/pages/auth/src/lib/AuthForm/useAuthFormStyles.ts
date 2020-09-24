import { makeStyles } from '@material-ui/core/styles';

export const useAuthFormStyles = makeStyles({
  host: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },

  authForm: {
    width: '600px',

    ['@media (max-width: 599px)']: {
      width: '100%',
    },

    '& .MuiCard-root': {
      padding: '16px',
      overflow: 'inherit',
    },

    '& .MuiCardContent-root': {
      padding: 0,
    },
  },

  header: {
    justifyContent: 'center',
    margin: '-50px 0 20px',
    padding: '20px',
    backgroundColor: '#1f2637',
    color: '#9ca5b9',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(31, 38, 55, 0.4)',
    borderRadius: '2px',
    textTransform: 'uppercase',

    '& .MuiCardHeader-title': {
      fontSize: '18px',
      fontWeight: 'normal',
    },
  },

  formField: {
    width: '100%',
  },

  actions: {
    justifyContent: 'flex-end',
    padding: '16px 0px',

    ['@media (max-width: 425px)']: {
      flexDirection: 'column',
    },

    '& button': {
      minWidth: '150px',
      textTransform: 'uppercase',

      ['@media (max-width: 425px)']: {
        width: '100%',
        margin: '8px',
      },
    },
  },
});
