import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import * as React from "react";

interface IEquipmentProps {}

const Equipment: React.FunctionComponent<IEquipmentProps> = (props) => {
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

export default Equipment;
