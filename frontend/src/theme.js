import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Poppins", sans-serif',
        },
        "*": {
          fontFamily: '"Poppins", sans-serif',
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
