// src/components/gmaps-api-loader.jsx
import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";

function GooglePlacesAutocomplete({ onPlaceSelected }) {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps API
  useEffect(() => {
    const loadApi = async () => {
      try {
        const loader = new Loader({
          apiKey: "AIzaSyCcxy8h7YVJJIoovq8eDpt3rfpNXHJh0yI",
          version: "weekly",
          libraries: ["places"],
          language: "en",
          region: "US",
          nonce: undefined,
        });

        await loader.importLibrary("places");
        setIsApiLoaded(true);
        initAutocomplete();
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    if (!window.google) {
      loadApi();
    } else {
      setIsApiLoaded(true);
      initAutocomplete();
    }
  }, []);

  // Initialize Autocomplete
  const initAutocomplete = () => {
    if (!inputRef.current || !window.google.maps.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(regions)"],
        componentRestrictions: { country: ["us", "sg", "my"] },
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, []);

  return (
    <TextField
      fullWidth
      label="Search Places"
      variant="outlined"
      inputRef={inputRef}
      disabled={!isApiLoaded}
      placeholder={!isApiLoaded ? "Loading maps..." : undefined}
    />
  );
}

export default GooglePlacesAutocomplete;
