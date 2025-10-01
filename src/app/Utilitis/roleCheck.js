// utils/useRole.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useRole = () => {
  const { user } = useAuth(); // Firebase user
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await axios.get(`/api/users?uid=${user.uid}`);
        if (res.data) {
          setRole(res.data.role); // MongoDB থেকে role
        } else {
          setRole("user"); // default role
        }
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setRole("user"); // error হলে default
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.uid]);

  return { role, loading };
};
