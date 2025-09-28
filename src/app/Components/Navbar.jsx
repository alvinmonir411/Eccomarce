"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaInfoCircle,
  FaPhoneAlt,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useAuth();

  // Fetch cart items count
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const res = await axios.get(`/api/cart?userId=${user._id}`);
          setCartCount(res.data.length);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      };
      fetchCart();
    }
  }, [user]);

  const Navlinks = (
    <>
      <Link href="/" className="flex items-center gap-1 hovarText">
        <FaHome /> Home
      </Link>
      <Link href="/products" className="flex items-center gap-1 hovarText">
        <FaBoxOpen /> All Product
      </Link>
      <Link href="/about" className="flex items-center gap-1 hovarText">
        <FaInfoCircle /> About
      </Link>
      <Link href="/contact" className="flex items-center gap-1 hovarText">
        <FaPhoneAlt /> Contact
      </Link>
    </>
  );

  return (
    <div className="bg-gray-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <Link href="/">
          <Image src="/Logo.png" width={100} height={100} alt="Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex justify-center gap-8">{Navlinks}</div>

        {/* Right side icons */}
        <div className="flex items-center gap-4 text-gray-700 relative">
          <Link href="/search" className="hovarText">
            <FaSearch size={20} />
          </Link>
          <Link href="/favorites" className="hovarText">
            <FaHeart size={20} />
          </Link>

          {/* Cart Icon with count */}
          <Link href="/CartPage" className="hovarText relative">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={logout}
              className="hovarText flex items-center gap-1"
            >
              <FaUser size={20} /> Logout
            </button>
          ) : (
            <Link
              href="/auth/register"
              className="hovarText flex items-center gap-1"
            >
              <FaUser size={20} /> Register
            </Link>
          )}

          {/* Hamburger Menu */}
          <button
            className="md:hidden ml-2 text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 shadow-md px-4 py-3 flex flex-col gap-3">
          {Navlinks}
        </div>
      )}
    </div>
  );
};

export default Navbar;
