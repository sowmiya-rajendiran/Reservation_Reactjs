import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { reservationAPI } from "../instances/endpoint";

const stripePromise = loadStripe(
  "pk_test_51S3a6u1Fga9c5dvOzDHRRmczDpakQdcCsRv6FktBN6Hbzh8RcOWfnPfzXjFDsLXuQ0nckwunRPu2GWndSyDiTElu00qQ8Y7zJn"
);

const BookTableModal = ({ isOpen, onClose, restaurant }) => {
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 1,
    partySize: 2,
    tableType: "indoor",
    amount: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call backend to create reservation + Stripe session
      const { data } = await reservationAPI.createReservation({
        restaurantId: restaurant._id,
        ...form,
      });

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (result.error) {
        console.error(result.error.message);
        alert(result.error.message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-[#0000009c] bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Book a Table at {restaurant?.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min={today}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="block mb-1 font-medium">Number of Guests</label>
            <input
              type="number"
              name="guests"
              min="1"
              max="20"
              value={form.guests}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Table Type */}
          <div>
            <label className="block mb-1 font-medium">Table Type</label>
            <select
              name="tableType"
              value={form.tableType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              {["indoor", "window", "outdoor"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Party Size */}
          <div>
            <label className="block mb-1 font-medium">Party Size</label>
            <input
              type="number"
              value={form.guests}
              disabled
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              min="1"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter amount to pay"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer"
            >
              {loading ? "Processing..." : "Book & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookTableModal;