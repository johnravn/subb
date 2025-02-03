import {
  Alert,
  Box,
  Container,
  Snackbar,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import * as React from "react";
import Navbar from "../../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import firestore, { auth } from "../../firebase";
import { documentId } from "firebase/firestore/lite";
import { collection, doc, DocumentReference, getDoc } from "firebase/firestore";
import { Outlet } from "react-router-dom";
import { UserData } from "../../types";
interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const [openSuccessSnack, setOpenSuccessSnack] = React.useState(true);
  const handleCloseSuccessSnack = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccessSnack(false);
  };

  return (
    <>
      <Navbar
        firstname={userData?.firstName || ""}
        lastname={userData?.lastName || ""}
        img={userData?.profilePicture || ""}
      />
      <Container
        sx={{
          backgroundColor: "#808080",
          height: "1500px",
          width: "500px",
        }}
      >
        <Box>
          <Typography>Halla</Typography>
        </Box>
        <Outlet />
      </Container>
      <Snackbar
        open={openSuccessSnack}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnack}
          severity="success"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          Login successfull
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
