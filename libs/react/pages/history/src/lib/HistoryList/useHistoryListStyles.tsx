import { makeStyles, Theme } from '@material-ui/core/styles';

export const useHistoryListStyles = makeStyles((theme: Theme) => ({
  table: {
    '& .MuiTableRow-head': {
      height: 56,
    },

    '& .MuiTableCell-head': {
      fontSize: 12,
      color: 'rgba(0,0,0,.54)',
    },

    '& .MuiTableCell-sizeSmall': {
      paddingTop: 3,
      paddingBottom: 3,
    },

    '& a': {
      textDecoration: 'underline',
    },
  },

  pagination: {
    zIndex: `${theme.zIndex.modal + 1} !important` as any,
  },
}));
