"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user?.uid) {
      const fetchCart = async () => {
        try {
          const res = await axios.get(`/api/addTocard?userId=${user.uid}`);
          if (res.data.success) {
            setCartItems(res.data.items);
            setCartCount(res.data.items.length);
          } else {
            console.error("API error:", res.data.error);
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      };
      fetchCart();
    }
  }, [user]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart ({cartCount})</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg flex flex-col items-center"
            >
              <img
                src={item.images?.[0] || "/no-image.png"}
                alt={item.title}
                className="w-32 h-32 object-cover mb-2"
              />
              <h2 className="font-semibold">{item.title}</h2>
              <p>
                {item.price} {item.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
