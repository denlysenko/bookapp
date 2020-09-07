import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2f364a',
      light: '#434b62',
      dark: '#2f364a',
      contrastText: 'rgba(156,165,185,.87)',
    },
    secondary: {
      main: '#f16441',
      light: '#f8cec3',
      dark: '#d85738',
      contrastText: 'rgba(black, 0.87)',
    },
    warning: {
      main: '#f44336',
      light: '#ffcdd2',
      dark: '#d32f2f',
    },
  },
});
