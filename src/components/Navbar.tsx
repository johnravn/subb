import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import firestore, { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserAuth } from "../context/userAuthContext";

interface NavbarProps {
  firstname: string;
  lastname: string;
  img: string;
}

export default function Navbar({ firstname, lastname, img }: NavbarProps) {
  const { logOut } = useUserAuth();

  const fullname: string = firstname + " " + lastname;

  const navItems = [
    {
      name: "Home",
      path: "/home/dashboard",
    },
    {
      name: "Profile",
      path: "/home/profile",
    },
    {
      name: "Equipment",
      path: "/home/equipment",
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          backgroundColor: "#090909",
          position: "sticky",
          left: 0,
          top: 0,
        }}
      >
        <Stack direction={"row"}>
          <Stack direction={"row"}>
            {navItems.map((entry) => (
              <Link
                to={entry.path}
                style={{
                  textDecoration: "none",
                  color: "#f0f0f0",
                  marginInline: "30px",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontSize: "2rem" }}>
                  {entry.name}
                </Typography>
              </Link>
            ))}
            <IconButton onClick={logOut}>
              <LogoutIcon />
            </IconButton>
          </Stack>
          <Stack direction={"row"}>
            <Typography>{fullname}</Typography>
            <Avatar alt={fullname} src={img} />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
