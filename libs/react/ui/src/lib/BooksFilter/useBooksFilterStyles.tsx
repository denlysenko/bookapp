import { makeStyles } from '@material-ui/core/styles';

export const useBooksFilterStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

    ['@media (max-width: 768px)']: {
      flexDirection: 'column',
      height: 'auto',
      alignItems: 'flex-start',
      paddingBottom: '1rem',
    },

    '& .MuiToggleButtonGroup-root': {
      background: '#ffffff',
    },

    '& .MuiToggleButton-root': {
      fontSize: 12,
      fontWeight: 'normal',
      textTransform: 'inherit',
      color: 'rgba(0,0,0,.87)',

      '&.Mui-selected': {
        background: '#97b3ce',
        color: '#ffffff',
      },
    },

    '& .MuiFormControl-root': {
      flexBasis: '35%',
      fontSize: 14,

      ['@media (max-width: 768px)']: {
        width: '100%',
        marginTop: '1em',
      },

      '& .MuiInputBase-root, & .MuiFormLabel-root': {
        color: '#9ca5b9',
      },

      '& .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderColor: '#9ca5b9',
      },
    },
  },
});
