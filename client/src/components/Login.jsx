import React, { useContext } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import * as yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";
import http from "../http";
import { fetchUserData } from "../hooks/useAuthCheck";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password at least 1 letter and 1 number"
        ),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http
        .post("/user/login", data)
        .then(async (res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          // Fetch merged user data
          const currentUserData = await fetchUserData();
          setUser(currentUserData); // ← Set complete user data
          
          navigate("/");
        })
        .catch(function (err) {
          console.log(err.response);
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await http.post("/user/google-login", {
          token: codeResponse.code,
        });

        localStorage.setItem("accessToken", res.data.accessToken);
        const currentUserData = await fetchUserData();
        setUser(currentUserData);
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
    flow: "auth-code", // or "auth-code" if you're using the code flow
  });

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ToastContainer />
      <Typography variant="h5" sx={{ my: 2 }}>
        Login
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Login
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={googleLogin}
          startIcon={
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width="20"
            />
          }
        >
          Sign in with Google
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
