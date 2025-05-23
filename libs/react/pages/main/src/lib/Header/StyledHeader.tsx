import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

export const StyledHeader = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,

  '& .MuiToolbar-gutters': {
    paddingLeft: '16px',
    paddingRight: '16px',
  },

  '& .brand': {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
    textDecoration: 'none',
  },

  '& .menu-toggler': {
    display: 'none',

    '@media (max-width: 600px)': {
      display: 'inline-block',
    },
  },

  '& .user-menu-toggler': {
    color: ' #9ca5b9',
    textTransform: 'capitalize',
  },

  '& .menu': {
    zIndex: `${theme.zIndex.modal + 1} !important`,
  },

  '& .link': {
    display: 'block',
    color: 'rgba(0,0,0, 0.87)',
    textDecoration: 'none',
    fontSize: '14px',

    '&.active': {
      background: 'rgba(0, 0, 0, 0.04)',
    },
  },

  '& .avatar': {
    width: '36px',
    height: '36px',
    marginRight: '10px',
    border: '2px solid #fff',
    borderRadius: '50%',
    verticalAlign: 'top',
  },

  '& .user-menu': {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    height: '100%',
  },
}));
