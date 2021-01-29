import { makeStyles } from '@material-ui/core/styles';

export const useReadBookStyles = makeStyles({
  root: {
    position: 'relative',
    height: 'calc(100vh - 128px)',

    ['@media (max-width: 576px)']: {
      height: 'calc(100vh - 112px)',
    },
  },
});
