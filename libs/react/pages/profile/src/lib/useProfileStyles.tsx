import { makeStyles } from '@material-ui/core/styles';

export const useProfileStyles = makeStyles({
  root: {
    maxWidth: 780,
    height: 'calc(100% - 128px)',
    overflowY: 'auto',

    ['@media (max-width: 576px)']: {
      height: 'calc(100% - 112px)',
    },

    '& .MuiCardHeader-root': {
      paddingBottom: 8,
    },

    '& .MuiCardContent-root': {
      paddingTop: 0,
    },

    '& .profile-page': {
      display: 'flex',

      ['@media (max-width: 768px)']: {
        flexDirection: 'column',
      },

      '& .avatar': {
        flexBasis: '25%',

        ['@media (min-width: 768px)']: {
          marginRight: '1.5rem',
        },
      },
    },
  },
});
