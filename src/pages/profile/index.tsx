import * as React from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { UserData } from "../../types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Grid from "@mui/material/Grid2";
import dayjs, { Dayjs } from "dayjs";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import firestore, { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = () => {
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

  //IMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGEIMAGE
  const storage = getStorage();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const path = "/profilePictures/" + user?.uid;
    const imageRef = ref(storage, path);

    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching image url:", error);
        setImageUrl("/iconOnWhite.svg");
      });
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSubmit = async () => {
    if (!selectedFile || !user) {
      console.log("Missing file or user, contact support");
      return;
    }

    const path = "/profilePictures/" + user?.uid;
    const imageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(imageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error.message);
      },
      async () => {
        // Get the download URL once the upload is complete
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Finished uploading");
        setUploadProgress(null);
        setSelectedFile(null);
        setOpenSuccessSnack(true);
        // Update Firestore with the new image URL
        if (user?.uid) {
          await setDoc(
            doc(firestore, "users", user.uid),
            {
              profilePicture: downloadURL, // Store the URL of the uploaded file
            },
            { merge: true }
          );

          // You can update the local state for displaying the image
          setImageUrl(downloadURL);
        }
      }
    );
  };

  const theme = useTheme();

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
    setUserData({ ...userData, [name]: value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setUserData({ ...userData, born: date.toISOString() });
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setOpenLoadingSnack(true);
      //   console.log("The user info is: ", userInfo);
      // const userCredential = await signUp(userInfo.email, userInfo.password);
      const userId = user?.uid;
      if (userId != null || userId != undefined) {
        await setDoc(doc(firestore, "users", userId), {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          phone: userData?.phone,
          email: userData?.email,
          born: userData?.born,
          address: userData?.address,
          zip: userData?.zip,
          area: userData?.area,
          profilePicture: `profilePictures/${user?.uid}`,
        });
      } else {
        throw new Error("User ID is null or undefined");
      }
      setOpenLoadingSnack(false);
      setOpenSuccessSnack(true);
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
          width: "100%",
          maxWidth: 650,
          [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: 500,
          },
        }}
      >
        {" "}
        <form onSubmit={handleSubmit}>
          <CardHeader title="Edit profile" />
          <CardContent>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid size={12}>
                <Stack
                  direction={"column"}
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {imageUrl === null ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <Avatar
                      alt={"Profilepicture"}
                      src={imageUrl || "/iconOnWhite.svg"}
                      sx={{ width: 150, height: 150 }}
                    />
                  )}
                  <Button variant="outlined" component="label">
                    Select File
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  {selectedFile && (
                    <Typography variant="body1">
                      Selected file: {selectedFile.name}
                    </Typography>
                  )}
                  {selectedFile?.name && (
                    <Button variant="contained" onClick={handleFileSubmit}>
                      Upload profile picture
                    </Button>
                  )}
                  {uploadProgress && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ width: "80%" }}
                    />
                  )}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  required
                  label="First name"
                  name="firstName"
                  variant="outlined"
                  value={userData?.firstName || ""}
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
                  value={userData?.lastName || ""}
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
                  value={userData?.phone || ""}
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
                  value={userData?.email || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date born"
                    value={userData?.born ? dayjs(userData?.born) : null} // Convert stored date back to Day.js
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
                  value={userData?.address || ""}
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
                  value={userData?.zip || ""}
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
                  value={userData?.area || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardContent>
            <Button variant="contained" type="submit" fullWidth>
              Submit changes
            </Button>
          </CardContent>
        </form>
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
          Submitting changes
          <CircularProgress
            color="inherit"
            size={"0.9rem"}
            sx={{ marginLeft: "10px" }}
          />
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
          Success!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
