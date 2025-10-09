import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledBookDetails = styled(Box)(() => ({
  display: 'flex',

  '@media (max-width: 768px)': {
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
      marginBottom: '10px',
      height: '270px',
    },

    '& .view-num': {
      display: 'flex',
      width: '100%',
      minHeight: '24px',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'rgba(156, 165, 185, 0.87)',

      '& span': {
        marginLeft: '10px',
      },
    },

    '& .actions': {
      margin: '10px 0',

      '& .MuiIconButton-root': {
        padding: '6px',
      },
    },
  },

  '& .details': {
    flex: 1,

    '& h3, & h4': {
      marginTop: '10px',
      marginBottom: '10px',
    },

    '& h3': {
      fontSize: '24px',
    },

    '& h4': {
      fontSize: '18px',
    },

    '@media (min-width: 768px)': {
      marginLeft: '15px',

      '& h3': {
        marginTop: 0,
      },
    },
  },

  '& .toolbar': {
    fontSize: '14px',
  },
}));
