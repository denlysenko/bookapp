import { makeStyles } from '@material-ui/core/styles';

export const useAvatarSelectorStyles = makeStyles({
  root: {
    '& .MuiCard-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 154,
      marginBottom: '1rem',
      padding: 16,

      '& img': {
        width: 150,
        height: 150,
      },
    },

    '& .MuiButton-root': {
      width: '100%',
      textTransform: 'uppercase',
    },
  },
});
