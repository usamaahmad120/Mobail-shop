import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const navigate = useNavigate();

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

  const handleLogin = () => {
    if (!isFormValid) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("loggedUser", JSON.stringify(foundUser));
      alert(`Welcome ${foundUser.name}`);
      navigate("/");
    } else {
      alert("Invalid email or password!");
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
        className="absolute top-5 left-5 bg-[#502EC3] text-white px-4 py-2 rounded-lg hover:bg-[#3e26a3] transition"
      >
        ← Back to Home
      </button>

      {/* Login Box */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-[320px] h-[400px] border-none">
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
              ? "bg-[#502EC3] hover:bg-[#3e26a3] text-white"
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
