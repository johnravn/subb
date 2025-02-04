import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import firestore, { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserAuth } from "../context/userAuthContext";
import { useEffect, useState } from "react";

interface NavbarProps {
  firstname?: string | undefined;
  lastname?: string | undefined;
  img?: string | null;
}

export default function Navbar({ firstname, lastname, img }: NavbarProps) {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (firstname && lastname) {
      setFullname(firstname + " " + lastname);
    }
  }, [firstname, lastname]);

  const navItems = [
    {
      index: 0,
      name: "Home",
      path: "/home/dashboard",
    },
    {
      index: 1,
      name: "Profile",
      path: "/home/profile",
    },
    {
      index: 2,
      name: "Equipment",
      path: "/home/equipment",
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          backgroundColor: "rgba(9, 9, 9, 0.5)",
          position: "fixed",
          paddingX: "16px",
          left: 0,
          top: 0,
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            height: "65px",
            paddingY: "10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack
            direction={"row"}
            spacing={6}
            sx={{
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Box
              component={"img"}
              onClick={() => navigate("/home/dashboard")}
              src="/logoWhite.svg"
              alt="Ekte Lyd logo"
              sx={{
                transition:
                  "transform 0.1s ease-in-out, opacity 0.3s ease-in-out", // Smooth transition
                height: "40px",
                "&:hover": {
                  transform: "scale(1.02)", // Slight zoom effect
                  cursor: "pointer",
                },
              }}
            />
            <Stack
              direction={"row"}
              spacing={6}
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {navItems.map((entry) => (
                <Link
                  key={entry.index}
                  to={entry.path}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      transition:
                        "transform 0.1s ease-in-out, opacity 0.3s ease-in-out", // Smooth transition
                      fontSize: "1.2rem",
                      "&:hover": {
                        transform: "scale(1.04)", // Slight zoom effect
                        cursor: "pointer",
                      },
                    }}
                  >
                    {entry.name}
                  </Typography>
                </Link>
              ))}
              <Box onClick={logOut}>
                <Typography
                  variant="h5"
                  sx={{
                    transition:
                      "transform 0.1s ease-in-out, opacity 0.3s ease-in-out", // Smooth transition
                    color: "#fff",
                    fontSize: "1.2rem",
                    "&:hover": {
                      transform: "scale(1.04)", // Slight zoom effect
                      cursor: "pointer",
                    },
                  }}
                >
                  Log out
                </Typography>
              </Box>
            </Stack>
          </Stack>
          <Link
            to={"/home/profile"}
            style={{
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <Stack
              direction={"row"}
              spacing={2}
              sx={{
                transition:
                  "transform 0.1s ease-in-out, opacity 0.3s ease-in-out", // Smooth transition
                justifyContent: "space-evenly",
                alignItems: "center",
                "&:hover": {
                  transform: "scale(1.04)", // Slight zoom effect
                  cursor: "pointer",
                },
              }}
            >
              {fullname === undefined ? (
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ fontSize: "1rem" }}
                  width={130}
                />
              ) : (
                <Typography variant="h6">{fullname}</Typography>
              )}
              {img === null ? (
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={45}
                  height={45}
                />
              ) : (
                <Avatar
                  alt={fullname}
                  src={img}
                  sx={{ height: "45px", width: "45px" }}
                />
              )}
            </Stack>
          </Link>
        </Stack>
      </Box>
    </>
  );
}
