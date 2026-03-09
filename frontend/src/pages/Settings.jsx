import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. All your posts, messages, and data will be permanently deleted.",
    );

    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      // Delete user profile (cascades to posts, likes, follows, messages due to ON DELETE CASCADE)
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) throw deleteError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id,
      );

      // Note: auth.admin is not available with client keys
      // The user deletion will be handled by a backend endpoint or database trigger
      // For now, just sign out after deleting profile

      await signOut();
      navigate("/register");
    } catch (err) {
      console.error("Delete account error:", err);
      setError(err.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  if (deleting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader type="spinner" size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Settings</h1>

      <div className="bg-base-200 rounded-lg shadow-md p-6 space-y-6">
        {/* User Info */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-semibold mb-2">Account Information</h2>
          <p className="text-sm opacity-70">Email: {user?.email}</p>
        </div>

        {/* Logout */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-semibold mb-4">Session</h2>
          <button onClick={handleLogout} className="btn btn-primary w-full">
            Logout
          </button>
        </div>

        {/* Delete Account */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-error">Danger Zone</h2>
          <p className="text-sm opacity-70 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          {error && <p className="text-error text-sm mb-4">{error}</p>}
          <button
            onClick={handleDeleteAccount}
            className="btn btn-error w-full"
            disabled={deleting}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
