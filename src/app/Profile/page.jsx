"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import { useRouter } from "next/navigation";
import { useRole } from "./../Utilitis/roleCheck";

const ProfilePage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  if (authLoading || roleLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">
        Hello, {user.displayName || "User"}!
      </h1>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-4">Role: {role}</p>

      {role === "admin" && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          onClick={() => router.push("/admin")}
        >
          Admin Panel
        </button>
      )}

      {role === "user" && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-2"
          onClick={() => router.push("/user-dashboard")}
        >
          User Dashboard
        </button>
      )}

      <button
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
