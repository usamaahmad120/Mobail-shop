import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCartFromStorage } from "../../store/cartSlice";
import { loadWishlistFromStorage } from "../../store/wishlistSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      val && !emailRegex.test(val) ? "Please enter a valid email address" : ""
    );
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPassError(
      val.length > 0 && val.length < 6
        ? "Password must be at least 6 characters"
        : ""
    );
  };

  const isFormValid =
    email && password.length >= 6 && !emailError && !passError;

const handleLogin = async () => {
  if (!isFormValid) return;

  const res = await fetch("http://127.0.0.1:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    dispatch(loadCartFromStorage());
    dispatch(loadWishlistFromStorage());

    alert(`Welcome ${data.user.name}`);
    navigate("/");
  } else {
    alert("Invalid login");
  }
};

  const toggleToRegister = () => {
    navigate("/register");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {/* Back Button */}
      <button
        onClick={goToHome}
        className="absolute top-5 left-5 shop-button-secondary px-4 py-2 rounded-lg transition"
      >
        ← Back to Home
      </button>

      {/* Login Box */}
      <div className="shop-card p-7 w-[320px] h-auto border-none">
        <h2 className="text-2xl font-bold text-center text-[#502EC3] mb-6">
          Welcome Back!
        </h2>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className={`w-full p-2 border-b-2 outline-none ${
              emailError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#502EC3]"
            }`}
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2 border-b-2 outline-none ${
              passError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#502EC3]"
            }`}
            value={password}
            onChange={handlePasswordChange}
          />
          {passError && (
            <p className="text-red-500 text-sm mt-1">{passError}</p>
          )}
        </div>

        <span className="text-[#502EC3] font-semibold cursor-pointer hover:underline">
          Forgot Password
        </span>

        <button
          className={`w-full py-2 rounded mt-2 ${
            isFormValid
              ? "shop-button-primary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-sm text-center mt-3 text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-[#502EC3] font-semibold cursor-pointer hover:underline"
            onClick={toggleToRegister}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
