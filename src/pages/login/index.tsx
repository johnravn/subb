import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { UserLogIn } from "../../types";

interface ILoginProps {}

const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login: React.FunctionComponent<ILoginProps> = () => {
  const [userLogInInfo, setUserLogInInfo] =
    React.useState<UserLogIn>(initialValue);
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserLogInInfo({ ...userLogInInfo, [name]: value });
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("The user info is: ", userLogInInfo);
      await logIn(userLogInInfo.email, userLogInInfo.password);
      navigate("/");
    } catch (error) {
      console.log("The error is: ", error);
    }
  };

  const handleGoogleSignIn = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log("The google error is: ", error);
    }
  };

  return (
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
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
        >
          Log in with Google
        </Button>
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
  );
};

export default Login;
