import React from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 pt-32 px-4 pb-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#502EC3] h-32 relative">
          <div className="absolute left-1/2 -bottom-14 -translate-x-1/2">
            <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center text-[#502EC3] text-6xl">
              <FaUserCircle />
            </div>
          </div>
        </div>

        <div className="pt-20 pb-10 px-4 sm:px-8 text-center">
          <h2 className="text-3xl font-bold">
            {user?.name || "Guest User"}
          </h2>

          <p className="text-gray-500 mt-1">Welcome to your profile</p>

          <div className="grid md:grid-cols-2 gap-5 mt-10 text-left">
            <div className="bg-gray-50 p-5 rounded-xl border">
              <div className="flex gap-2 text-[#502EC3] mb-2">
                <FaEnvelope />
                <span>Email</span>
              </div>
              <p>{user?.email}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border">
              <div className="flex gap-2 text-[#502EC3] mb-2">
                <FaPhone />
                <span>Phone</span>
              </div>
              <p>{user?.phone}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl border md:col-span-2">
              <div className="flex gap-2 text-[#502EC3] mb-2">
                <FaMapMarkerAlt />
                <span>Address</span>
              </div>
              <p>Rawalpindi, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
