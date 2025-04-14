import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserData } from "../hooks/useAuthCheck";

const Profile = ({ user, setUser }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteButtonRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Handler function for password visibility
  const handleToggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3)
      .max(50)
      .required("Name is required")
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "Name only allows letters, spaces and characters: ' - , ."
      ),
    mobile: yup
      .string()
      .min(8)
      .max(15)
      .required("Mobile is required")
      .matches(/^\+?[0-9]{8,15}$/, "Please enter a valid mobile number"),
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      mobile: user?.mobileNumber || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await http.put("/profile", values);

        // Refresh merged user data
        const currentUserData = await fetchUserData();
        setUser(currentUserData);

        formik.setValues({
          name: currentUserData.name || "",
          mobile: currentUserData.mobileNumber || "",
        });

        toast.success("Profile updated successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to update profile.";
        toast.error(errorMessage);
        console.error("Profile update error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const submitPasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      await http.post("/user/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to change password.";
      toast.error(msg);
      console.error("Password change error:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, PNG, or GIF allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Max size is 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      setUploading(true);
      await http.post("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh merged user data
      const currentUserData = await fetchUserData();
      setUser(currentUserData);

      toast.success("Profile picture updated!");
      setSelectedFile(null);

      // Clean up the object URL to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload profile picture.";
      toast.error(errorMessage);
      console.error("Profile picture upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await http.delete("/user/delete-account");
      toast.success("Your account has been deleted.");
      localStorage.removeItem("accessToken");
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Delete account failed:", err);
      toast.error("Failed to delete account.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    // Return focus to the button
    setTimeout(() => {
      deleteButtonRef.current?.focus();
    }, 100); // slight delay to ensure modal is fully closed
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <ToastContainer position="bottom-right" />

      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      {/* Profile Form Section */}
      <Box
        sx={{ mt: 3, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fafafa" }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Profile Info
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={user?.email || ""}
            disabled
          />
          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            {...formik.getFieldProps("mobile")}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              startIcon={
                formik.isSubmitting ? <CircularProgress size={20} /> : null
              }
            >
              {formik.isSubmitting ? "Saving" : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                localStorage.removeItem("accessToken");
                setUser(null);
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          </Box>
        </form>
      </Box>

      {/* Profile Picture Section */}
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6">Profile Picture</Typography>
        <Avatar
          src={
            previewUrl || user?.profilePicture || "/images/default-avatar.png"
          }
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif"
          style={{ display: "none" }}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            Select Image
          </Button>
          {previewUrl && (
            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={handleUpload}
              disabled={uploading}
              startIcon={
                formik.isSubmitting ? <CircularProgress size={20} /> : null
              }
            >
              {uploading ? "Uploading" : "Upload"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Password Change Section */}
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6">Change Password</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Current Password"
          name="currentPassword"
          type={showPassword.current ? "text" : "password"}
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleToggleVisibility("current")}
                  edge="end"
                >
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          name="newPassword"
          type={showPassword.new ? "text" : "password"}
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleToggleVisibility("new")}
                  edge="end"
                >
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Confirm New Password"
          name="confirmPassword"
          type={showPassword.confirm ? "text" : "password"}
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleToggleVisibility("confirm")}
                  edge="end"
                >
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={submitPasswordChange}
          sx={{ mt: 2 }}
        >
          Change Password
        </Button>
      </Box>

      {/* Danger Zone */}
      <Box
        sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "#fff3f3" }}
      >
        <Typography variant="h6" color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Deleting your account is permanent and cannot be undone.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteModalOpen(true)}
          sx={{ mt: 2 }}
          ref={deleteButtonRef}
        >
          Delete My Account
        </Button>
      </Box>
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle color="error">Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action will permanently delete your account. This cannot be
            undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
