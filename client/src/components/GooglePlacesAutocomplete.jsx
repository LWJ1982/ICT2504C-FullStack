// src/components/GooglePlacesAutocomplete.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircularProgress from "@mui/material/CircularProgress";
import PlaceIcon from "@mui/icons-material/Place";
import debounce from "lodash/debounce";
import axios from "axios";

const GooglePlacesAutocomplete = ({ onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const isSelectionRef = useRef(false);
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch with proper dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (input) => {
      if (!input) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            input,
            includedRegionCodes: ["SG"],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": API_KEY,
              "X-Goog-FieldMask":
                "suggestions.placePrediction.text,suggestions.placePrediction.placeId",
            },
          }
        );

        setPredictions(response.data.suggestions || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [API_KEY]
  );

  // Trigger search on input change
  useEffect(() => {
    if (isSelectionRef.current) {
      isSelectionRef.current = false;
      return;
    }
    debouncedFetch(inputValue);
  }, [inputValue, debouncedFetch]);

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask":
              "addressComponents,formattedAddress,displayName",
          },
        }
      );

      // Transform to map Google's response properties
      return {
        address_components: response.data.addressComponents?.map((comp) => ({
          types: comp.types,
          longText: comp.longText,
          shortText: comp.shortText,
        })),
        formatted_address: response.data.formattedAddress,
      };
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const handleSelect = async (prediction) => {
    isSelectionRef.current = true;
    debouncedFetch.cancel();

    const placeDetails = await fetchPlaceDetails(
      prediction.placePrediction.placeId
    );

    // Debugging: Log raw API response
    // console.log("Place Details Response:", placeDetails);

    if (placeDetails) {
      onPlaceSelected({
        address_components: placeDetails.address_components,
        formatted_address: placeDetails.formatted_address,
      });
    }

    setInputValue(prediction.placePrediction.text.text);
    setPredictions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", margin: "16px 0" }}>
      <TextField
        fullWidth
        label="Search address"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        slotProps={{
          input: {
            endAdornment: isLoading ? <CircularProgress size={20} /> : null,
          },
        }}
      />

      {isOpen && predictions.length > 0 && (
        <List
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 1,
            backgroundColor: "#f5f5f5",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {predictions.map((prediction, index) => (
            <ListItem
              button="true"
              key={index}
              onClick={() => handleSelect(prediction)}
            >
              <ListItemIcon>
                <PlaceIcon />
              </ListItemIcon>
              <ListItemText primary={prediction.placePrediction.text.text} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;
