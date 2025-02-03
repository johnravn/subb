import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { UserSignIn } from "../../types";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid2";
import dayjs, { Dayjs } from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import firestore from "../../firebase";
import { FirebaseError } from "firebase/app";

interface ISignupProps {}

const initialValue: UserSignIn = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  born: "",
  address: "",
  zip: "",
  area: "",
  profilePicture: "",
};

const Signup: React.FunctionComponent<ISignupProps> = () => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const theme = useTheme();

  const [userInfo, setuserInfo] = useState<UserSignIn>(initialValue);
  //   const { googleSignIn, signUp } = useUserAuth();
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const usersCollectionRef = collection(firestore, "users");

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
  const [openUsedEmailSnack, setOpenUsedEmailSnack] = React.useState(false);
  const handleCloseUsedEmailSnack = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenUsedEmailSnack(false);
  };
  const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false);
  const handleCloseSuccessSnack = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessSnack(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setuserInfo({ ...userInfo, [name]: value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setuserInfo({ ...userInfo, born: date.toISOString() });
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setOpenLoadingSnack(true);
      //   console.log("The user info is: ", userInfo);
      await signUp(userInfo.email, userInfo.password);
      await addDoc(usersCollectionRef, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phone: userInfo.phone,
        email: userInfo.email,
        born: userInfo.born,
        address: userInfo.address,
        zip: userInfo.zip,
        area: userInfo.area,
        profilePicture: userInfo.profilePicture,
      });
      setOpenLoadingSnack(false);
      setOpenSuccessSnack(true);
      await delay(1000);
      navigate("/login");
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log("FirebaseError code: " + error.code);
        setOpenLoadingSnack(false);
        if (error.code === "auth/email-already-in-use") {
          setOpenUsedEmailSnack(true);
        }
      } else {
        console.log("Normal error is: ", error);
      }
    }
  };

  return (
    <>
      <Card
        sx={{
          width: "100%", // Default width
          maxWidth: 650, // Default max width
          [theme.breakpoints.down("sm")]: {
            maxWidth: "100%", // Full width on small screens (less than 600px)
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: 500, // Maximum width for medium screens (900px and above)
          },
        }}
      >
        {" "}
        <form onSubmit={handleSubmit}>
          <CardHeader title="Sign up" />
          <CardContent>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  label="First name"
                  name="firstName"
                  variant="outlined"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  label="Last name"
                  name="lastName"
                  variant="outlined"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  label="Phone"
                  name="phone"
                  variant="outlined"
                  value={userInfo.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  label="E-mail"
                  name="email"
                  variant="outlined"
                  value={userInfo.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
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
              </Grid>
              <Grid size={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date born"
                    value={userInfo.born ? dayjs(userInfo.born) : null} // Convert stored date back to Day.js
                    onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  label="Address"
                  name="address"
                  variant="outlined"
                  value={userInfo.address}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  label="ZIP code"
                  name="zip"
                  variant="outlined"
                  value={userInfo.zip}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  label="Area"
                  name="area"
                  variant="outlined"
                  value={userInfo.area}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
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
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
              Sign in
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
          Signing up
          <CircularProgress
            color="inherit"
            size={"0.9rem"}
            sx={{ marginLeft: "10px" }}
          />
        </Alert>
      </Snackbar>
      <Snackbar
        open={openUsedEmailSnack}
        autoHideDuration={6000}
        onClose={handleCloseUsedEmailSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseUsedEmailSnack}
          severity="warning"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          Email already in use
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccessSnack}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnack}
          severity="success"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          Signup successfull
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
