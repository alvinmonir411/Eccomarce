"use client";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please login
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <div className="bg-base-100 shadow-card rounded-box p-6 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>
          <strong>Name:</strong> {user.displayName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button onClick={logout} className="btn btn-warning mt-4 w-full">
          Logout
        </button>
      </div>
    </div>
  );
}
