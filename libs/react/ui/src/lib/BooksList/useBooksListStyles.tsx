import { makeStyles } from '@material-ui/core/styles';

export const useBooksListStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -0.75rem -1.5rem -0.75rem',

    ['@media (max-width: 576px)']: {
      margin: 0,
      justifyContent: 'center',
    },

    '& .list-item-wrapper': {
      width: '100%',
      maxWidth: 200,
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      marginBottom: '1.5rem',

      ['@media (max-width: 768px)']: {
        maxWidth: '50%',
      },

      ['@media (max-width: 576px)']: {
        maxWidth: '85%',
      },
    },

    '& .list-item': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 350,
      cursor: 'pointer',
      padding: '1rem',
    },

    '& .cover': {
      maxWidth: 200,
      borderRadius: 5,
      overflow: 'hidden',
      marginBottom: 20,

      '& img': {
        width: '100%',
        maxHeight: 227,
        height: 'auto',
        verticalAlign: 'top',
      },
    },

    '& .title': {
      textDecoration: 'none',
      fontSize: 16,
      textTransform: 'capitalize',
    },

    '& .author': {
      fontSize: 12,
    },
  },
});
