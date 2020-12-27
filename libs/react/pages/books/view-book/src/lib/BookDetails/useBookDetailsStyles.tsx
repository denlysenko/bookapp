import { makeStyles } from '@material-ui/core/styles';

export const useBookDetailsStyles = makeStyles({
  root: {
    display: 'flex',

    ['@media (max-width: 768px)']: {
      flexDirection: 'column',
    },

    '& .cover': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexBasis: '25%',

      '& img': {
        display: 'block',
        marginBottom: 10,
        height: 270,
      },

      '& .view-num': {
        display: 'flex',
        width: '100%',
        minHeight: 24,
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgba(156,165,185,.87)',

        '& span': {
          marginLeft: 10,
        },
      },

      '& .actions': {
        margin: '10px 0',

        '& .MuiIconButton-root': {
          padding: 6,
        },
      },
    },

    '& .details': {
      flex: 1,

      '& h3, h4': {
        marginTop: 10,
        marginBottom: 10,
      },

      '& h3': {
        fontSize: 24,
      },

      '& h4': {
        fontSize: 18,
      },

      ['@media (min-width: 768px)']: {
        marginLeft: 15,

        '& h3': {
          marginTop: 0,
        },
      },
    },

    '& .toolbar': {
      padding: 16,
      backgroundColor: '#eef1f7',
      fontSize: 14,
    },
  },
});
