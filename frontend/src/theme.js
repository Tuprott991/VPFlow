import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Nunito", sans-serif',
          userSelect: "none",
        },
        "*": {
          fontFamily: '"Nunito", sans-serif',
          userSelect: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          color: "#838486",
          borderColor: "#EEEFF1",
        },
      },
    },
  },
});

export default theme;
