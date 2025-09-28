"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Addtocard = ({ id, quantity }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // If quantity is not provided, default to 1
  const finalQuantity = quantity ? quantity : 1;

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to your cart.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/addTocard", {
        userId: user.uid,
        productId: id,
        quantity: finalQuantity,
      });

      if (res.data.success) {
        console.log("Cart updated:", res.data);
        alert(`Added ${finalQuantity} item(s) to cart!`);
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
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`w-full px-4 py-2 rounded-lg font-medium transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : "bg-orange-500 hover:bg-orange-600 text-white"
      }`}
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default Addtocard;
