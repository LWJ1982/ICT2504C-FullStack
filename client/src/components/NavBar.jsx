// components/NavBar.jsx
import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Typography,
  Avatar
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function NavBar() {
  const { user } = useContext(UserContext);
  console.log(user)
  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
            {/* Use your brand or title here */}
            <Typography variant="h6" component="div" sx={{ mr: 2 }}>
              User Registration & Management System
            </Typography>
          </Link>

          {user && (
            <>
              <Link
                to="/addresses"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button color="inherit">Addresses</Button>
              </Link>

              {/* Profile Edit icon on the right */}
              <Typography sx={{ ml: "auto", mr: 1 }}>
                Welcome, {user?.name || "User"}
              </Typography>

              <IconButton
                component={Link}
                to="/profile"
                color="inherit"
                sx={{ p: 0 }}
              >
                {user.profilePicture ? (
                  <Avatar
                    src={user.profilePicture}
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle sx={{ fontSize: 32 }} />
                )}
              </IconButton>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
