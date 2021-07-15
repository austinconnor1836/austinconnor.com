import { createMuiTheme, ThemeOptions } from '@material-ui/core';

export const DarkTheme: ThemeOptions = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#302C4A',
      light: '#534D80',
      contrastText: '#fff',
    },
    secondary: {
      main: '#3A27B8',
      light: '#6857DB',
      contrastText: '#fff',
    },
    success: {
      main: '#4E8E34',
    },
    warning: {
      main: '#d64200',
      contrastText: '#fff',
    },
    error: {
      main: 'rgba(191,36,36, 1)',
      contrastText: '#fff',
    },
    info: {
      main: '#057ab4',
    },
    grey: { 700: '#797979', 100: '#e9e9e9' },
  },
  typography: {
    // fontFamily: `"Oxygen-Bold", "Oxygen Bold", "Oxygen", "sans-serif"`,
    fontFamily: [`"Dancing Script", cursive"`].join(","),
    body1: {
      fontFamily: `'Roboto-Regular', 'Roboto', 'sans-serif'`,
      color: '#e0d8d7',
    },
    body2: {
      fontFamily: `'Roboto-Regular', 'Roboto', 'sans-serif'`,
      color: '#e0d8d7',
    },
    h1: {
      fontSize: '2rem',
      color: '#e0d8d7',
      fontWeight: 600,
      lineHeight: '38px',
      margin: '1rem 0',
    },
    h2: {
      fontFamily: `"Oxygen-Bold", "Oxygen Bold", "Oxygen", "sans-serif"`,
      fontSize: '1.4rem',
      fontWeight: 500,
      color: '#e0d8d7',
      margin: '0.75rem 0',
    },
    h3: {
      fontFamily: `"Oxygen-Bold", "Oxygen Bold", "Oxygen", "sans-serif"`,
      fontSize: '1.2rem',
      fontWeight: 400,
      color: '#e0d8d7',
      margin: '0.45rem 0',
    },
    h6: {
      color: '#e0d8d7',
      fontWeight: 700,
    },
    caption: {
      fontSize: '11px',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
    MuiLink: {
      root: {
        fontFamily: `"Roboto-Regular", "Roboto", "sans-serif"`,
        fontWeight: 400,
        color: '#e0d8d7',
        fontSize: '0.9rem',
        cursor: 'pointer',
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        fontSize: '0.9rem',
        lineHeight: '1.5rem',
      },
      arrow: {
        color: 'rgba(0,0,0,0.85)',
      },
    },
    MuiFormHelperText: {
      root: {
        fontSize: '0.8rem',
        marginTop: '0.15rem',
      },
    },
  },
});
