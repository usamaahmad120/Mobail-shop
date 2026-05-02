import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalAmount,
  clearCart,
} from "../store/cartSlice";
import {
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaShippingFast,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalAmount = useSelector(selectCartTotalAmount);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const shippingFee = 200;
  const grandTotal = Number(totalAmount) + shippingFee;

  const calculateItemTotal = (price, quantity) => {
    const numericPrice = Number(String(price).replace(/[$Rs,\s]/g, ""));
    return (numericPrice * quantity).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    setOrderStatus(null);

    try {
      const payload = {
        user_id: user?.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        notes: formData.notes,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(String(item.price).replace(/[$Rs,\s]/g, "")),
          quantity: item.quantity,
        })),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrderStatus({
          success: true,
          message: data.message || "Order placed successfully",
        });

        dispatch(clearCart());

        setTimeout(() => {
          navigate("/my-orders");
        }, 2000);
      } else {
        setOrderStatus({
          success: false,
          message: data.message || "Failed to place order",
        });

        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      setOrderStatus({
        success: false,
        message: "Server error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderStatus) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 px-4">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl shadow-lg p-10">
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FaShippingFast className="text-5xl text-gray-400" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mb-8">
            Add products before checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-[#502EC3] text-white px-8 py-3 rounded-lg hover:bg-[#3f22a0]"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderStatus?.success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-4xl text-green-500" />
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Order Placed Successfully
          </h2>

          <p className="text-gray-600 mb-3">
            {orderStatus.message}
          </p>

          <p className="text-sm text-gray-500">
            Redirecting to My Orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/shopping-cart")}
          className="flex items-center gap-2 text-[#502EC3] mb-6 hover:underline"
        >
          <FaArrowLeft />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Checkout
        </h1>

        {orderStatus && !orderStatus.success && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
            <FaTimes />
            {orderStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={placeOrder}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Shipping Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded-lg"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded-lg"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded-lg"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border p-3 rounded-lg"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  rows="3"
                  name="address"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-lg"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <textarea
                  rows="3"
                  name="notes"
                  placeholder="Order Notes (optional)"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid md:grid-cols-3 gap-4 border-t pt-5 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaShieldAlt className="text-green-500" />
                  Secure Checkout
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaTruck className="text-blue-500" />
                  Fast Delivery
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaShippingFast className="text-[#502EC3]" />
                  Cash On Delivery
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#502EC3] text-white hover:bg-[#3f22a0]"
                }`}
              >
                {isSubmitting
                  ? "Processing Order..."
                  : `Place Order - Rs ${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 mb-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-sm font-bold text-[#502EC3]">
                        Rs {calculateItemTotal(item.price, item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({totalItems} items)
                  </span>
                  <span>Rs {Number(totalAmount).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs {shippingFee}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#502EC3]">
                  Rs {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;