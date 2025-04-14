import { useEffect } from "react";
import http from "../http";

// Reusable function to fetch merged user data
export async function fetchUserData() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  try {
    const [authRes, profileRes] = await Promise.all([
      http.get("/user/auth"),
      http.get("/profile"),
    ]);

    return {
      ...authRes.data.user,
      ...profileRes.data.user,
    };
  } catch (err) {
    console.error("Error fetching user data:", err);
    localStorage.removeItem("accessToken");
    return null;
  }
}

export default function useAuthCheck(setUser) {
  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUserData();
      if (userData) setUser(userData);
    };

    loadUser();
  }, [setUser]);
}
