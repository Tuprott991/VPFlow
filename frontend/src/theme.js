import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
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
