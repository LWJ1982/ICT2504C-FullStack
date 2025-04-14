import React, { useEffect, useState } from "react";
import http from "../http";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Container,
  Grid2
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await http.get("/addresses");
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to fetch addresses.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleEdit = (id) => {
    navigate(`/addresses/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await http.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((addr) => addr.address_id !== id));
      toast.success("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await http.patch(`/addresses/${id}/isDefault`, { isDefault: true });
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.address_id === id,
        }))
      );
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address.");
    }
  };

  return (
    <Container maxWidth="md">
      <ToastContainer position="bottom-right" />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          User Addresses
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => navigate("/addresses/create")}
        >
          Create New Address
        </Button>

        {loading ? (
          <Typography sx={{ p: 2 }}>Loading addresses...</Typography>
        ) : !addresses.length ? (
          <Typography sx={{ p: 2 }}>No addresses found.</Typography>
        ) : (
          addresses.map((addr) => (
            <Card
              key={addr.address_id}
              sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
            >
              <CardContent>
                <Grid2
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid2>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {addr.addressLine1} {addr.addressLine2}, {addr.city},{" "}
                      {addr.state}, {addr.country}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Postal Code: {addr.postalCode}
                    </Typography>
                  </Grid2>
                  {addr.isDefault && (
                    <Grid2>
                      <Chip
                        icon={<StarIcon />}
                        label="Default"
                        color="primary"
                      />
                    </Grid2>
                  )}
                </Grid2>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleEdit(addr.address_id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => handleDelete(addr.address_id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                {!addr.isDefault && (
                  <Tooltip title="Set as Default">
                    <IconButton
                      onClick={() => handleSetDefault(addr.address_id)}
                      color="warning"
                    >
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </CardActions>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}

export default Addresses;
