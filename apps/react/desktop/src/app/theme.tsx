import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#eeeeee',
          paper: '#ffffff',
        },
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
    },
    dark: {
      palette: {
        background: {
          default: '#121414',
          paper: '#1e2020',
        },
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
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          color: 'light-dark(var(--mui-palette-primary-main), #bfc6df)',
        },
        outlined: {
          color: 'light-dark(var(--mui-palette-primary-main), #bfc6df)',
          borderColor: 'light-dark(var(--mui-palette-primary-main), #bfc6df)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: 'light-dark(var(--mui-palette-primary-main), #bfc6df)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor:
            'light-dark(var(--mui-palette-primary-main), var(--mui-palette-primary-main)) !important',
          color:
            'light-dark(var(--mui-palette-primary-contrastText), var(--mui-palette-primary-contrastText)) !important',
        },
      },
    },
  },
});
