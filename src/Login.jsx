import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState(false); // ✅ NEW

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      // ❌ removed alert
      setAuthError(true); // ✅ show error page
    }
  };

  /* ================= ERROR PAGE ================= */

  if (authError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Access Denied 🚫
        </h1>

        <p className="text-gray-300 mb-6">
          You are restricted to access this page.
        </p>

        <button
          onClick={() => setAuthError(false)} // 🔁 back to login
          className="bg-green-500 px-4 py-2 rounded font-semibold"
        >
          Back to Login
        </button>
      </div>
    );
  }

  /* ================= LOGIN FORM ================= */

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* 🔥 Password with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 rounded bg-gray-800 text-white w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="bg-green-500 p-2 rounded font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}