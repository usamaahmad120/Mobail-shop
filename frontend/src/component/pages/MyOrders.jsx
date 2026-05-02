import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/my-orders/${user.id}`
      );

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.log("Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Delivered") {
      return <FaCheckCircle className="text-green-500" />;
    }

    if (status === "Shipped") {
      return <FaTruck className="text-blue-500" />;
    }

    return <FaClock className="text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-[#502EC3]">
            Loading Orders...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
          <FaBoxOpen className="text-6xl text-gray-400 mx-auto mb-5" />

          <h2 className="text-3xl font-bold mb-3">
            Please Login First
          </h2>

          <p className="text-gray-500">
            You need to login to see your orders.
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
          <FaBoxOpen className="text-6xl text-gray-400 mx-auto mb-5" />

          <h2 className="text-3xl font-bold mb-3">
            No Orders Yet
          </h2>

          <p className="text-gray-500">
            Your placed orders will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32 px-4 pb-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#502EC3] mb-6">
          My Orders
        </h2>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-5 bg-gray-50 hover:shadow-md transition"
            >
              {/* Top Section */}
              <div className="flex justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Order #{order.id}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#502EC3] text-lg">
                    Rs {order.total}
                  </p>

                  <div className="flex items-center gap-2 justify-end">
                    {getStatusIcon(order.order_status)}
                    <span>{order.order_status}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>

                    <span className="font-semibold">
                      Rs {item.subtotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div className="border-t mt-4 pt-4 text-sm text-gray-600 grid md:grid-cols-3 gap-3">
                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment_method}
                </p>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.payment_status}
                </p>

                <p>
                  <strong>City:</strong> {order.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;