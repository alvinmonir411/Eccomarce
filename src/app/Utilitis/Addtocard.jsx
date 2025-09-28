"use client";
import React, { useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Addtocard = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const res = await axios.post("/api/addTocard", {
        userId: user.uid,
        productId: id,
      });

      if (res.data.success) {
        console.log("Cart updated:", res.data);
      } else {
        console.error("Error:", res.data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </div>
  );
};

export default Addtocard;
