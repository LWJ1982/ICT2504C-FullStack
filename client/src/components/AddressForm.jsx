// src/pages/AddressForm.jsx
import React, { useState, useEffect } from "react";
import http from "../http";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import GooglePlacesAutocomplete from "./gmaps-api-loader";
import GooglePlacesAutocomplete from "./GooglePlacesAutocomplete";

function AddressForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEdit = Boolean(id);

  // Fetch address data for editing
  useEffect(() => {
    if (isEdit) {
      const fetchAddress = async () => {
        setLoading(true);
        try {
          const res = await http.get(`/addresses/${id}`);
          setFormData(res.data);
        } catch (err) {
          setError(`Failed to load address : ${err}`);
        } finally {
          setLoading(false);
        }
      };
      fetchAddress();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await http.put(`/addresses/${id}`, formData);
        toast.success("Updated address.");
      } else {
        await http.post("/addresses", formData);
        toast.success("Created address.");
      }
      navigate("/addresses");
    } catch (err) {
      setError(`Save failed. Please try again.\n Traceback : ${err}`);
      toast.error("Updated address.");
    }
  };

  const handlePlaceSelected = (place) => {
    const address = {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };

    // Use `place.address_components` directly (no longer `undefined`)
    const components = place.address_components || [];

    // Address Line 1: Component 0 (street number) + Component 1 (street name)
    if (components.length >= 2) {
      address.addressLine1 = [
        components[0]?.longText || "",
        components[1]?.longText || "",
      ]
        .join(" ")
        .trim();
    }

    // City: Component 2
    if (components.length >= 3) address.city = components[2]?.longText || "";

    // State: Component 3 (use shortText)
    if (components.length >= 4) address.state = components[3]?.shortText || "";

    // Country: Component 4
    if (components.length >= 5) address.country = components[4]?.longText || "";

    // Postal Code: Component 5
    if (components.length >= 6)
      address.postalCode = components[5]?.longText || "";

    // Fallback to formatted address
    if (!address.addressLine1) {
      address.addressLine1 = place.formatted_address || "";
    }

    // Debugging: Log the resolved data
    console.log("Parsed Address:", address);
    console.log("Original Place Data:", place);

    setFormData((prev) => ({
      ...prev,
      ...address,
      addressLine2: prev.addressLine2, // Preserve existing value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <ToastContainer position="bottom-right" />
      <Box sx={{ p: 2, maxWidth: "600px", margin: "auto" }}>
        <Typography variant="h4" gutterBottom>
          {isEdit ? "Edit Address" : "Create New Address"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <GooglePlacesAutocomplete
            onPlaceSelected={(place) => {
              handlePlaceSelected(place);
            }}
          />
          {/* Existing Form Fields */}
          <TextField
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Address Line 2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddressForm;
