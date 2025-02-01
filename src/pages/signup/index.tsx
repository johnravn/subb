import * as React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
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
import { UserSignIn } from "../../types";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";

interface ISignupProps {}

const initialValue: UserSignIn = {
  fullName: "",
  email: "",
  password: "",
};

const Signup: React.FunctionComponent<ISignupProps> = () => {
  const [userInfo, setuserInfo] = useState<UserSignIn>(initialValue);
  const { googleSignIn, signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setuserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("The user info is: ", userInfo);
      await signUp(userInfo.email, userInfo.password);
      navigate("/login");
    } catch (error) {
      console.log("The error is: ", error);
    }
  };

  const handleGoogleSignIn = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    try {
      await googleSignIn();
      navigate("/login");
    } catch (error) {
      console.log("The google error is: ", error);
    }
  };

  return (
    <Card sx={{ minWidth: 380, padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <CardHeader title="Sign up" />
        <CardContent>
          <TextField
            required
            label="Full name"
            name="fullName"
            variant="outlined"
            value={userInfo.fullName}
            onChange={handleChange}
            fullWidth
          />
        </CardContent>
        <CardContent>
          <TextField
            required
            label="E-mail"
            name="email"
            variant="outlined"
            value={userInfo.email}
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
            value={userInfo.password}
            onChange={handleChange}
            fullWidth
          />
        </CardContent>
        <CardContent>
          <Button variant="contained" type="submit" fullWidth>
            Sign up
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
          Sign up with Google
        </Button>
      </CardContent>
      <CardContent>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Signup;
