import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledMain = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',

  '& .content': {
    flexGrow: 1,
    height: 0,
    marginLeft: 250,
    backgroundColor: '#fafafa',

    '@media (max-width: 599px)': {
      marginLeft: 0,
    },
  },
}));
