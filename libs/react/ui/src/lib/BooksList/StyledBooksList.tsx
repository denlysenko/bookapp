import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledBooksList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '0 -0.75rem -1.5rem -0.75rem',

  [theme.breakpoints.down('sm')]: {
    margin: 0,
    justifyContent: 'center',
  },

  '& .list-item-wrapper': {
    width: '100%',
    maxWidth: 200,
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
    marginBottom: '1.5rem',

    [theme.breakpoints.down('md')]: {
      maxWidth: '50%',
    },

    [theme.breakpoints.down('sm')]: {
      maxWidth: '85%',
    },
  },

  '& .list-item': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 350,
    cursor: 'pointer',
    padding: '1rem',
  },

  '& .cover': {
    maxWidth: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,

    '& img': {
      width: '100%',
      maxHeight: 227,
      height: 'auto',
      verticalAlign: 'top',
    },
  },

  '& .title': {
    textDecoration: 'none',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: '5px',
  },

  '& .author': {
    fontSize: 12,
  },

  '& .MuiRating-root': {
    marginTop: '5px',
  },
}));
