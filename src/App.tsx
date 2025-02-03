import * as React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { UserAuthProvider } from "./context/userAuthContext";

const darkTheme = createTheme({
  colorSchemes: {
    dark: true, // Change to "light" for default mode
  },
});

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserAuthProvider>
        <RouterProvider router={router} />
      </UserAuthProvider>
    </ThemeProvider>
  );
};

export default App;
