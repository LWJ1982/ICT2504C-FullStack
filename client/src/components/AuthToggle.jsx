// components/AuthToggle.jsx
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AuthToggle({ authMode, setAuthMode }) {
  const navigate = useNavigate();

  const handleToggle = (event, newMode) => {
    if (!newMode) return;

    setAuthMode(newMode);
    // If toggled to "login", navigate to /login, else /register
    if (newMode === "login") {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <ToggleButtonGroup
      value={authMode}
      exclusive
      onChange={handleToggle}
      sx={{ mb: 2 }}
    >
      <ToggleButton value="login">Login</ToggleButton>
      <ToggleButton value="register">Register</ToggleButton>
    </ToggleButtonGroup>
  );
}
