"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { googleProvider } from "@/app/lib/firebase";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
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
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleEmailLogin}
        className="bg-white p-6 rounded shadow-md flex flex-col gap-4 w-80"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
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
        <button className="bg-blue-500 text-white p-2 rounded">Login</button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white p-2 rounded"
        >
          Sign in with Google
        </button>
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-500">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
