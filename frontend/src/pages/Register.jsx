import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [success, setSuccess] = useState(false); // 👈 new state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      // ✅ Show success message and delay redirect
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500); // wait 1.5 seconds
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
      {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-success text-success-content px-4 py-2 rounded shadow">
          Registered successfully!
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-base-200 rounded-box shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
