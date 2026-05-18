import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";
import { formatPrice } from "../../utils/currency";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewStatus, setReviewStatus] = useState({});
  const [submittingReview, setSubmittingReview] = useState(null);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  const fetchOrders = useCallback(async () => {
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
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [fetchOrders, user?.id]);

  const getStatusIcon = (status) => {
    if (status === "Delivered") {
      return <FaCheckCircle className="text-green-500" />;
    }

    if (status === "Shipped") {
      return <FaTruck className="text-blue-500" />;
    }

    return <FaClock className="text-yellow-500" />;
  };

  const getReviewDraft = (item) => {
    const savedReview = item.review;

    return reviewDrafts[item.id] || {
      rating: savedReview?.rating || 5,
      comment: savedReview?.comment || "",
    };
  };

  const updateReviewDraft = (itemId, field, value) => {
    setReviewDrafts((current) => ({
      ...current,
      [itemId]: {
        ...(current[itemId] || {}),
        [field]: value,
      },
    }));
  };

  const submitReview = async (order, item) => {
    const draft = getReviewDraft(item);
    setSubmittingReview(item.id);
    setReviewStatus((current) => ({ ...current, [item.id]: null }));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/product-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          order_id: order.id,
          order_item_id: item.id,
          product_id: item.product_id,
          rating: Number(draft.rating),
          comment: draft.comment,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to save review");
      }

      setReviewStatus((current) => ({
        ...current,
        [item.id]: { type: "success", message: payload.message },
      }));

      fetchOrders();
    } catch (error) {
      setReviewStatus((current) => ({
        ...current,
        [item.id]: { type: "error", message: error.message },
      }));
    } finally {
      setSubmittingReview(null);
    }
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

          <h2 className="text-3xl font-bold mb-3">Please Login First</h2>

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

          <h2 className="text-3xl font-bold mb-3">No Orders Yet</h2>

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
              <div className="flex justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.id}</h3>

                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-[#502EC3] text-lg">
                    {formatPrice(order.total)}
                  </p>

                  <div className="flex items-center gap-2 justify-end">
                    {getStatusIcon(order.order_status)}
                    <span>{order.order_status}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                {order.items.map((item) => {
                  const canReview = order.order_status === "Delivered" && item.product_id;
                  const draft = getReviewDraft(item);
                  const status = reviewStatus[item.id];

                  return (
                    <div key={item.id} className="rounded-lg bg-white p-4">
                      <div className="flex justify-between text-sm">
                        <span>
                          {item.product_name} x {item.quantity}
                        </span>

                        <span className="font-semibold">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>

                      {canReview && (
                        <div className="mt-4 border-t pt-4">
                          <div className="grid gap-3 md:grid-cols-[150px_1fr_auto] md:items-end">
                            <label className="text-sm font-semibold text-gray-700">
                              Rating
                              <select
                                value={draft.rating}
                                onChange={(event) => updateReviewDraft(item.id, "rating", event.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#502EC3] focus:outline-none"
                              >
                                <option value="5">5 stars</option>
                                <option value="4">4 stars</option>
                                <option value="3">3 stars</option>
                                <option value="2">2 stars</option>
                                <option value="1">1 star</option>
                              </select>
                            </label>

                            <label className="text-sm font-semibold text-gray-700">
                              Product feedback
                              <textarea
                                value={draft.comment}
                                onChange={(event) => updateReviewDraft(item.id, "comment", event.target.value)}
                                rows="2"
                                placeholder="Share your experience after delivery"
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#502EC3] focus:outline-none"
                              />
                            </label>

                            <button
                              onClick={() => submitReview(order, item)}
                              disabled={submittingReview === item.id}
                              className="rounded-lg bg-[#502EC3] px-5 py-2 font-semibold text-white transition hover:bg-[#3f22a0] disabled:opacity-60"
                            >
                              {submittingReview === item.id
                                ? "Saving..."
                                : item.review
                                  ? "Update Review"
                                  : "Submit Review"}
                            </button>
                          </div>

                          {status && (
                            <p
                              className={`mt-2 text-sm ${
                                status.type === "success" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {status.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-4 pt-4 text-sm text-gray-600 grid md:grid-cols-3 gap-3">
                <p>
                  <strong>Payment:</strong> {order.payment_method}
                </p>

                <p>
                  <strong>Payment Status:</strong> {order.payment_status}
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
