import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useHeaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.modal + 1,

      '& .MuiToolbar-gutters': {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },

    brand: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 0,
      textDecoration: 'none',
    },

    menuToggler: {
      display: 'none',

      ['@media (max-width: 600px)']: {
        display: 'inline-block',
      },
    },

    userMenuToggler: {
      color: ' #9ca5b9',
      textTransform: 'capitalize',
    },

    menu: {
      zIndex: `${theme.zIndex.modal + 1} !important` as any,
    },

    link: {
      display: 'block',
      color: 'rgba(0,0,0, 0.87)',
      textDecoration: 'none',
      fontSize: '14px',

      '&.active': {
        background: 'rgba(0, 0, 0, 0.04)',
      },
    },

    avatar: {
      width: '36px',
      height: '36px',
      marginRight: '10px',
      border: '2px solid #fff',
      borderRadius: '50%',
      verticalAlign: 'top',
    },

    userMenu: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      height: '100%',
    },
  })
);
