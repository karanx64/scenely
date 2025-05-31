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
      <h1 className="text-3xl text-center font-semibold mb-20 text-base-content">
        Settings
      </h1>
      <div className="sm:flex-col md:flex-row min-h-screen flex items-center justify-center gap-6">
        <ThemeSwitcher className="h-50 w-50  btn-accent" />
        <button
          onClick={() => {
            setshowLogoutModal(true);
          }}
          className="btn  h-50 w-50 "
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-50 h-50  btn btn-error"
        >
          Delete Account
        </button>
      </div>

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
