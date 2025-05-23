import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear token and redirect
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Settings</h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-red-100 text-red-600"
      >
        Logout
      </button>

      <button
        onClick={handleDeleteAccount}
        className="w-full bg-red-600 text-white py-2 rounded-lg"
      >
        Delete Account
      </button>
    </main>
  );
}
