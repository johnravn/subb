import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Link,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { UserLogIn } from "../../types";
import { FirebaseError } from "firebase/app";

interface ILoginProps {}

const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login: React.FunctionComponent<ILoginProps> = () => {
  const [userLogInInfo, setUserLogInInfo] =
    React.useState<UserLogIn>(initialValue);
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const [openLoadingSnack, setOpenLoadingSnack] = React.useState(false);
  const handleCloseLoadingSnack = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenLoadingSnack(false);
  };
  const [openLoginFailSnack, setOpenLoginFailSnack] = React.useState(false);
  const handleCloseLoginFailSnack = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenLoginFailSnack(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserLogInInfo({ ...userLogInInfo, [name]: value });
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenLoadingSnack(true);
    try {
      console.log("The user info is: ", userLogInInfo);
      await logIn(userLogInInfo.email, userLogInInfo.password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/invalid-email"
        ) {
          setOpenLoadingSnack(false);
          setOpenLoginFailSnack(true);
        }
      }
      console.log("The error is: ", error);
    }
  };

  return (
    <>
      <Card sx={{ minWidth: 380, padding: 2 }}>
        <form onSubmit={handleSubmit}>
          <CardHeader title="Log in" />
          <CardContent>
            <TextField
              required
              label="E-mail"
              name="email"
              variant="outlined"
              value={userLogInInfo.email}
              onChange={handleChange}
              fullWidth
            />
          </CardContent>
          <CardContent>
            <TextField
              required
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={userLogInInfo.password}
              onChange={handleChange}
              fullWidth
            />
          </CardContent>
          <CardContent>
            <Button variant="contained" type="submit" fullWidth>
              Log in
            </Button>
          </CardContent>
        </form>
        <CardContent>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
        </CardContent>
        <CardContent>
          <Typography sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
              Create account
            </Link>
          </Typography>
        </CardContent>
      </Card>
      <Snackbar
        open={openLoadingSnack}
        autoHideDuration={6000}
        onClose={handleCloseLoadingSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseLoadingSnack}
          severity="info"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          Logging in
          <CircularProgress
            color="inherit"
            size={"0.9rem"}
            sx={{ marginLeft: "10px" }}
          />
        </Alert>
      </Snackbar>
      <Snackbar
        open={openLoginFailSnack}
        autoHideDuration={6000}
        onClose={handleCloseLoginFailSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseLoginFailSnack}
          severity="error"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          Wrong email or password
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
