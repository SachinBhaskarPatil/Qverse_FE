import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#079893',
    },
    secondary: {
      main: '#2E3A59',
    },
    light: {
      main: '#FFFFFF',
    },
    error: {
      main: '#E71818;',
    },
    background: {
      default: '#FFFFFF',
      secondary: '#070D1D',
    },
    action: {
      disabledBackground: '#48b4b28f',
      disabled: '#00000069',
    },
  },
  typography: {
    fontFamily: ['montserrat', 'Arial', 'sans-serif'].join(','),
    fontSize: 16,
    fontWeightVeryLight: 200,
    fontWeightLight: 400,
    fontWeightMedium: 500,
    fontWeightMediumDark: 600,
    fontWeightDark: 700,
    fontWeightVeryDark: 800,
    fontWeightultraDark: 900,
  },
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h5',
  subtitle1: 'h4',
  subtitle2: 'h6',
  body1: 'span',
  body2: 'span',
  caption: 'caption',
  lightFont: {
    fontSize: '12px',
  },
});

export default theme;