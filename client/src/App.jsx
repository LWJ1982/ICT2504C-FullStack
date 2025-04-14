import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "@mui/material";
import UserContext from "./contexts/UserContext";

// Import pages/components
import LandingPage from "./pages/LandingPage";
import AddressPage from "./pages/AddressPage";
import AddressForm from "./components/AddressForm";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/ProfilePage";
import AuthToggle from "./components/AuthToggle";
import NavBar from "./components/NavBar";

// Import hooks
import useAuthCheck from "./hooks/useAuthCheck";


export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  // On mount, if there's a token in localStorage, attempt to fetch the user.
  // TODO This make the user state very choppy, and force me to remount the user state at Login and Profile Pages
  useAuthCheck(setUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <NavBar />

        <Container sx={{ mt: 2 }}>
          {/* Show toggle only if user NOT logged in */}
          {!user && (
            <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
          )}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={!user ? <Login /> : <LandingPage />} />

            {/* Auth routes redirect if user is logged in */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />

            {/* Protected Routes: only render these if user is logged in, else redirect */}
            {user && (
              <>
                <Route path="/home" element={<LandingPage />} />
                <Route path="/addresses" element={<AddressPage />} />
                <Route path="/addresses/create" element={<AddressForm />} />
                <Route path="/addresses/edit/:id" element={<AddressForm />} />
                <Route
                  path="/profile"
                  element={<Profile user={user} setUser={setUser} />}
                />
              </>
            )}

            {/* Catch-all: if none match, go home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </Router>
    </UserContext.Provider>
  );
}
