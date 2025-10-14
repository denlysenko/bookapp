import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const StyledBooksFilter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    alignItems: 'flex-start',
    paddingBottom: '1rem',
  },

  '& .MuiToggleButtonGroup-root': {
    background: 'light-dark(#ffffff, #1e2538)',
  },

  '& .MuiToggleButton-root': {
    fontSize: 12,
    fontWeight: 'normal',
    textTransform: 'inherit',
    color: 'light-dark(rgba(0,0,0,.87), rgb(226,226,226))',

    '&.Mui-selected': {
      background: '#cee5ff',
      color: '#004a76',
      borderLeftColor: 'rgba(0, 0, 0, 0.12)',
    },
  },

  '& .MuiFormControl-root': {
    flexBasis: '35%',
    fontSize: 14,

    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: '1em',
    },

    '& .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderColor: '#9ca5b9',
    },
  },
}));
