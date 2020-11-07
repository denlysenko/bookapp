import { makeStyles } from '@material-ui/core/styles';

// tslint:disable: no-duplicate-string
export const useAddBookFormStyles = makeStyles({
  root: {
    display: 'flex',

    ['@media (max-width: 768px)']: {
      flexDirection: 'column',
    },

    '& .cover': {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '25%',

      '& .MuiCard-root': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        padding: 16,
        minHeight: 212,

        '& img': {
          width: 150,
          height: 212,
        },
      },

      ['@media (min-width: 768px)']: {
        marginRight: '1.5rem',
        maxWidth: 180,
      },
    },

    '& .form': {
      '& .MuiTextField-root': {
        width: '100%',

        '&:first-of-type': {
          marginTop: 0,
        },
      },

      ['@media (max-width: 768px)']: {
        marginTop: '1rem',
      },

      '& .epub': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& .MuiButton-root': {
          width: 180,

          ['@media (max-width: 768px)']: {
            width: '100%',
          },
        },
      },

      '& .price': {
        display: 'block',
        width: 180,

        ['@media (max-width: 768px)']: {
          display: 'inline-flex',
          width: '100%',
        },
      },

      '& .MuiCardActions-root': {
        justifyContent: 'flex-end',
        paddingRight: 0,
      },
    },
  },
});
