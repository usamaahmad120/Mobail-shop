import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCartFromStorage } from "../../store/cartSlice";
import { loadWishlistFromStorage } from "../../store/wishlistSlice";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setNameError(val.trim() === "" ? "Name is required" : "");
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailError(
      val && !emailRegex.test(val)
        ? "Please enter a valid email address"
        : ""
    );
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhone(val);

    setPhoneError(
      val.length > 0 && val.length !== 11
        ? "Phone number must be exactly 11 digits"
        : ""
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

    if (confirmPass && val !== confirmPass) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmPassChange = (e) => {
    const val = e.target.value;
    setConfirmPass(val);

    setConfirmError(val !== password ? "Passwords do not match" : "");
  };

  const isFormValid =
    name &&
    email &&
    phone.length === 11 &&
    password.length >= 6 &&
    password === confirmPass &&
    !nameError &&
    !emailError &&
    !phoneError &&
    !passError &&
    !confirmError;

  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    phone,
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
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          alert(firstError);
        } else {
          alert(data.message || "Registration failed");
        }
      }
    } catch (error) {
      alert("Server error");
      console.log(error);
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-24">
      {/* Back Button */}
      <button
        onClick={goToHome}
        className="absolute top-5 left-4 sm:left-5 shop-button-secondary px-4 py-2 rounded-lg transition"
      >
        ← Back to Home
      </button>

      {/* Register Box */}
      <div className="shop-card p-5 sm:p-7 w-full max-w-[380px] h-auto border-none">
        <h2 className="text-2xl font-bold text-center text-[#502EC3] mb-6">
          Create Account
        </h2>

        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            className={`w-full p-2 border-b-2 outline-none ${
              nameError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#502EC3]"
            }`}
            value={name}
            onChange={handleNameChange}
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
        </div>

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

        {/* Phone */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            maxLength="11"
            className={`w-full p-2 border-b-2 outline-none ${
              phoneError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#502EC3]"
            }`}
            value={phone}
            onChange={handlePhoneChange}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
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

        {/* Confirm Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full p-2 border-b-2 outline-none ${
              confirmError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-[#502EC3]"
            }`}
            value={confirmPass}
            onChange={handleConfirmPassChange}
          />
          {confirmError && (
            <p className="text-red-500 text-sm mt-1">{confirmError}</p>
          )}
        </div>

        {/* Register Button */}
        <button
          className={`w-full py-2 rounded mt-2 ${
            isFormValid
              ? "shop-button-primary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          onClick={handleRegister}
        >
          Register
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-center mt-3 text-gray-600">
          Already have an account?{" "}
          <span
            className="text-[#502EC3] font-semibold cursor-pointer hover:underline"
            onClick={goToLogin}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
