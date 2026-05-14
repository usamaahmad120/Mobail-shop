import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Unable to send message.");
      }

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setStatus({
        type: "success",
        message: "Message sent successfully.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Message could not be sent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16">
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
          <div>
            <p className="text-[#5C2EC0] font-semibold mb-3">Contact Us</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Need help with an order or product?
            </h1>
            <p className="text-gray-600 text-lg leading-8">
              Send us a message and our support team will get back to you. We can help with product details, checkout questions, delivery updates, and returns.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                <FaPhoneAlt className="text-[#5C2EC0]" />
                <span className="font-semibold text-gray-800">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                <FaEnvelope className="text-[#5C2EC0]" />
                <span className="font-semibold text-gray-800">support@electrashop.pk</span>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
                <FaMapMarkerAlt className="text-[#5C2EC0]" />
                <span className="font-semibold text-gray-800">Main Market, Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#5C2EC0]"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#5C2EC0]"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <input
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#5C2EC0]"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-[#5C2EC0] min-h-40"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                required
              />
            </div>

            {status && (
              <p
                className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 bg-[#5C2EC0] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a25a3] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
