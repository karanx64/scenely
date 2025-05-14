import { useNavigate } from "react-router-dom";

export default function Settings() {
  //logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-2">Settings</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium hover:bg-red-100 text-red-600"
      >
        <span>Logout</span>
      </button>
      <button className="w-full bg-gray-800 text-white py-2 rounded-lg">
        Delete Account
      </button>
    </main>
  );
}
