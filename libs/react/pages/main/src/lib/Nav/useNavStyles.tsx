import { makeStyles } from '@material-ui/core/styles';

export const useNavStyles = makeStyles({
  root: {
    '& .MuiList-padding': {
      paddingTop: 0,
    },
  },

  listItem: {
    display: 'block',

    '& .MuiTypography-body1': {
      color: '#78829d',
      fontSize: '14px',
    },

    '& .MuiListItemIcon-root': {
      minWidth: 'auto',
    },

    '& .material-icons': {
      width: 'auto',
      marginRight: '10px',
      fontSize: '20px',
      color: '#78829d',
    },

    textTransform: 'capitalize',

    '&.active': {
      background: '#15a4fa',

      '& .MuiListItem-button:hover': {
        background: '#15a4fa',
      },

      '& .MuiTypography-body1': {
        color: '#fff',
      },

      '& .material-icons': {
        color: '#fff',
      },
    },
  },

  divider: {
    display: 'block',
    width: '100%',
    height: '5px',
    background: '#19202e',
    borderTop: 'inset 1px rgba(0, 0, 0, 0.3)',
    borderBottom: 'inset 1px rgba(0, 0, 0, 0.3)',
  },

  footnote: {
    fontSize: '12px',

    '& span': {
      textTransform: 'none',
    },
  },

  action: {
    whiteSpace: 'normal',
  },
});
