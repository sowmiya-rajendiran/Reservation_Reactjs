import { useEffect, useState } from "react";
import { reservationAPI } from "../instances/endpoint";
import toast from "react-hot-toast";
import { Link } from "react-router";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
    tableType: "indoor",
  });

  // Helpers
  const getGuestsCountFromReservation = (r) => {
    if (!r) return 1;
    if (Array.isArray(r.guests)) return r.guests.length;
    const raw = r.guests ?? r.partySize ?? 1;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };

  const formatDateForInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const today = new Date().toISOString().split("T")[0];

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await reservationAPI.getMyReservations();
      const data = res?.data?.data ?? res?.data?.reservations ?? [];
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reservations");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Cancel reservation
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await reservationAPI.cancelReservation(reservationId);
      toast.success("Reservation cancelled");
      fetchReservations();
    } catch (err) {
      console.error(err);
      toast.error("Cancel failed");
    }
  };

  // Open edit modal
  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    const guestsCount = getGuestsCountFromReservation(reservation);
    setFormData({
      date: formatDateForInput(reservation?.date),
      time: reservation?.time || "",
      guests: guestsCount,
      tableType: reservation?.tableType || "indoor",
    });
  };

  // Save update
  const handleSave = async () => {
    if (!editingReservation) return;
    try {
      const guestsCount = Number(formData.guests) || 1;

      const payload = {
        date: formData.date || undefined,
        time: formData.time || undefined,
        tableType: formData.tableType || "indoor",
        partySize: guestsCount,
      };

      if (!Array.isArray(editingReservation.guests)) {
        payload.guests = guestsCount;
      }

      await reservationAPI.updateReservation(editingReservation._id, payload);
      toast.success("Reservation updated");
      setEditingReservation(null);
      fetchReservations();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center py-6">Loading reservations...</p>;

  return (
    <div className="">
      {reservations.length === 0 ? (
        <div>
          <p className="text-gray-500 text-center">You don’t have any reservations yet.</p>
          <div className="text-center mt-[30px]">
            <Link to='/restaurant' className="md:text-[17px] text-[15px] font-semibold bg-black text-white px-[20px] py-[8px] rounded">Explore Restaurants</Link>
          </div>
          
        </div>
        
      ) : (
        <div>
          <h2 className="lg:text-3xl text-[25px] font-bold mb-[30px]">🍽 My Reservations</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-[30px]">
            {reservations.map((r) => {
              const count =
                Array.isArray(r.guests) ? r.guests.length
                : Number(r.partySize ?? r.guests ?? 0) || 0;

              const isCancelled = r.status === "cancelled";

              return (
                <div
                  key={r._id}
                  className={`p-5 rounded-xl shadow-md  transition ${
                    isCancelled
                      ? "bg-gray-100 text-gray-400 opacity-70 cursor-not-allowed"
                      : "bg-gradient-to-r from-white to-gray-50 hover:shadow-lg"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {r.restaurant?.name || "Unknown Restaurant"}
                      </h3>
                      <p className="text-sm">
                        {r.date ? new Date(r.date).toLocaleDateString() : "—"} at {r.time || "--:--"}
                      </p>
                      <p className="text-sm mt-1">👥 {count} people</p>
                      {isCancelled && (
                        <p className="text-red-500 font-semibold mt-2">Reservation Cancelled</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(r)}
                        disabled={isCancelled}
                        className={`px-4 py-1 rounded-lg text-sm transition ${
                          isCancelled
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600 text-white"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelReservation(r._id)}
                        disabled={isCancelled}
                        className={`px-4 py-1 rounded-lg text-sm transition ${
                          isCancelled
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {editingReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              Edit Reservation at {editingReservation.restaurant?.name || "Restaurant"}
            </h3>

            <div className="space-y-3">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={formData.date || ""}
                  min={today}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  type="time"
                  value={formData.time || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.guests}
                  onChange={(e) => {
                    const n = Math.max(1, Math.min(20, parseInt(e.target.value || "0", 10)));
                    setFormData((p) => ({ ...p, guests: n }));
                  }}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Table Type */}
              <div>
                <label className="block text-sm font-medium">Table Type</label>
                <select
                  value={formData.tableType}
                  onChange={(e) => setFormData((p) => ({ ...p, tableType: e.target.value }))}
                  className="border w-full px-3 py-2 rounded"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="window">Window</option>
                </select>
              </div>

              {/* Party Size (read-only) */}
              <div>
                <label className="block text-sm font-medium">Party Size</label>
                <input
                  type="number"
                  value={formData.guests}
                  readOnly
                  className="border w-full px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingReservation(null)}
                className="px-4 py-2 rounded-md border cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;