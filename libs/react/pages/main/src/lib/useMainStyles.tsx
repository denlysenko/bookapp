import { makeStyles } from '@material-ui/core/styles';

export const useMainStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },

  drawer: {
    width: 250,
    flexShrink: 0,
  },

  drawerPaper: {
    width: 250,
    backgroundColor: '#1f2637',
  },

  drawerContainer: {
    overflow: 'auto',
  },

  content: {
    flexGrow: 1,
    height: 0,
    marginLeft: 250,
    backgroundColor: '#fafafa',

    ['@media (max-width: 599px)']: {
      marginLeft: 0,
    },
  },
});
