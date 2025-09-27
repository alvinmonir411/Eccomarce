"use client";
import React, { useState } from "react";

const Addtocard = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = () => {
    setLoading(true);
    console.log("Product added to cart:", id);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-10 py-3 rounded-2xl shadow-md transition w-full md:w-auto"
    >
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default Addtocard;
