import "./App.css";
import {
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  colorSchemes: {
    dark: true, // Change to "light" for default mode
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Typography variant="h1">H1 Heading</Typography>
      <Typography variant="h2">H2 Heading</Typography>
      <Typography variant="h3">H3 Heading</Typography>
      <Typography variant="h4">H4 Heading</Typography>
      <Typography variant="h5">H5 Heading</Typography>
      <Typography variant="h6">H6 Heading</Typography>

      <Typography variant="subtitle1">Subtitle 1</Typography>
      <Typography variant="subtitle2">Subtitle 2</Typography>

      <Typography variant="body1">Body 1 - Default text</Typography>
      <Typography variant="body2">Body 2 - Smaller text</Typography>

      <Typography variant="caption">Caption Text</Typography>
      <Typography variant="button">Button Text</Typography>
      <Typography variant="overline">Overline Text</Typography>
      <br></br>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </ThemeProvider>
  );
}

export default App;
