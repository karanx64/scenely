import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useState } from "react";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function Settings() {
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setshowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
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
      setError(err.message);
    }
  };

  return (
    <main className="p-20 space-y-20">
      <h1 className="text-3xl text-center font-semibold mb-20 text-base-content">Settings</h1>
      <ThemeSwitcher />
      <button
        onClick={() => {
          setshowLogoutModal(true);
        }}
        className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-error hover:bg-error/10"
      >
        Logout
      </button>
      {showLogoutModal && (
        <Modal
          title="Confirm Logout"
          description="Do you want to logout?"
          onClose={() => setshowLogoutModal(false)}
          actions={[
            <button className="btn" onClick={() => setshowLogoutModal(false)}>
              No
            </button>,
            <button className="btn btn-error" onClick={handleLogout}>
              Yes
            </button>,
          ]}
        ></Modal>
      )}

      <button
        onClick={() => setShowDeleteModal(true)}
        className="w-full bg-error text-error-content py-2 rounded-lg hover:bg-error/90"
      >
        Delete Account
      </button>
      {showDeleteModal && (
        <Modal
          title="Confirm Deletion"
          description="Are you sure you want to delete your account? This cannot be undone."
          onClose={() => setShowDeleteModal(false)}
          actions={[
            <button className="btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>,
            <button className="btn btn-error" onClick={handleDeleteAccount}>
              Delete
            </button>,
          ]}
        >
          {error && <p className="text-error mt-2">{error}</p>}
        </Modal>
      )}
    </main>
  );
}
