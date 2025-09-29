"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch cart items from DB
  const fetchCart = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/addTocard?userId=${user.uid}`);
      console.log(res.data.items);
      if (res.data.success) {
        // DB theke quantity asbe → UI te set hobe
        const items = res.data.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
        }));
        setCartItems(items);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // 🔹 Plus / Minus → UI only
  const handleQuantityChange = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity:
                type === "plus"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  // 🔹 Remove → UI + DB
  const removeItem = async (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      await axios.delete(`/api/addTocard?cartId=${id}`);
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // 🔹 Buy Now → latest UI quantity → DB
  const handleBuyNow = async (item) => {
    try {
      await axios.put(`/api/addTocard`, {
        cartId: item._id,
        quantity: item.quantity,
      });
      alert("✅ Order placed with latest quantity!");
      setCartItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      console.error("Buy Now error:", err);
    }
  };

  // 🔹 Calculate total safely
  const getItemTotal = (item) => {
    const price = Number(item.priceAtTime || item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return (price * qty).toFixed(2);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Your Cart
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Your cart is empty.
          <br />
          <span className="text-sm text-gray-400">Start shopping now!</span>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col items-center"
              >
                {/* Product Image */}
                <div className="w-36 h-36 mb-4">
                  <img
                    src={item.images?.[0] || "/no-image.png"}
                    alt={item.title || "Product"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Product Info */}
                <h2 className="font-semibold text-lg text-gray-800 text-center">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">{item.subtitle}</p>
                <p className="text-xl font-bold text-indigo-600 mb-3">
                  {getItemTotal(item)} {item.currency || "USD"}
                </p>

                {/* Quantity Control */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => handleQuantityChange(item._id, "minus")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="px-4 font-medium text-gray-700">
                    {String(item.quantity)}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item._id, "plus")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="max-w-lg mx-auto bg-white border border-gray-100 rounded-2xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Cart Summary
            </h2>
            <p className="text-lg mb-6">
              Total:{" "}
              <span className="font-bold text-indigo-600 text-2xl">
                {cartItems.reduce(
                  (acc, item) =>
                    acc + Number(item.price || 0) * Number(item.quantity || 0),
                  0
                )}{" "}
                {cartItems[0]?.currency || "USD"}
              </span>
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold hover:opacity-90 transition">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
