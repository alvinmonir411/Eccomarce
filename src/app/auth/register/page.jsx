"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/app/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Email/Password Signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      await axios.post(`${API_URL}/api/users`, {
        name: name,
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        createdAt: new Date(),
      });

      toast.success("Registered successfully!");
      router.push("/");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error(err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await axios.post(`${API_URL}/api/users`, {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });

      toast.success("Registered successfully!");
      router.push("/");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("User already exists!");
      } else {
        toast.error(err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleEmailSignup}
        className="bg-white p-6 rounded shadow-md flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center">Signup</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className={`bg-red-500 text-white p-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Signup with Google"}
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
