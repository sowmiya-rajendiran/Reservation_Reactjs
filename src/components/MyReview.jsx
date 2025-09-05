import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { reservationAPI, reviewAPI } from "../instances/endpoint";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const MyReviews = () => {
  const { user } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, comment: "" });
  const [photos, setPhotos] = useState([]);

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await reservationAPI.getMyReservations();
      const data = res?.data?.data ?? [];

      // Only one reservation per restaurant
      const seen = new Set();
      const unique = [];
      data.forEach((r) => {
        if (r.restaurant?._id && !seen.has(r.restaurant._id)) {
          seen.add(r.restaurant._id);
          unique.push(r);
        }
      });

      setReservations(unique);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reservations");
    }
  };

  // Fetch reviews for reserved restaurants
  const fetchReviews = async () => {
    try {
      const newReviews = {};
      for (const r of reservations) {
        const restaurantId = r.restaurant?._id;
        if (!restaurantId) continue;

        const res = await reviewAPI.getReviews(restaurantId);
        newReviews[restaurantId] = res.data?.reviews ?? [];
      }
      setReviews(newReviews);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length) fetchReviews();
  }, [reservations]);

  // Form change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setPhotos([...e.target.files]);
  };

  // Create or update review
  const handleSubmit = async (restaurantId) => {
    try {
      const fd = new FormData();
      fd.append("restaurantId", restaurantId);
      fd.append("rating", formData.rating);
      fd.append("comment", formData.comment);
      photos.forEach((file) => fd.append("photos", file));

      let res;
      if (editingReview) {
        res = await reviewAPI.updateReview(editingReview._id, fd);
        toast.success("Review updated");
      } else {
        res = await reviewAPI.createReview(fd);
        toast.success("Review added");
      }

      setEditingReview(null);
      setFormData({ rating: 5, comment: "" });
      setPhotos([]);

      // Update reviews state
      setReviews((prev) => ({
        ...prev,
        [restaurantId]: [
          res.data,
          ...(prev[restaurantId]?.filter((r) => r._id !== res.data._id) ?? []),
        ],
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to save review");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({ rating: review.rating, comment: review.comment });
  };

  const handleDelete = async (reviewId, restaurantId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await reviewAPI.deleteReview(reviewId);
      toast.success("Review deleted");

      setReviews((prev) => ({
        ...prev,
        [restaurantId]: prev[restaurantId].filter((r) => r._id !== reviewId),
      }));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="text-center py-6">No Reviews Yet..</p>;

  return (
    <div>
      <h2 className="lg:text-3xl text-[25px] font-bold mb-[30px]">Reviews</h2>
      <div className="lg:grid gap-6">
        {reservations.map((r) => {
          const restaurantId = r.restaurant?._id;
          if (!restaurantId) return null;

          const restaurantReviews = reviews[restaurantId] || [];
          const myReview = restaurantReviews.find(
            (rev) => rev.user?._id === user._id || rev.user === user._id
          );

          return (
            <div
              key={restaurantId}
              className="bg-white shadow-lg rounded-2xl p-6 md:mb-0 mb-[25px]"
            >
              {/* Restaurant Info */}
              <h3 className="text-xl font-semibold mb-1">{r.restaurant.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Reserved on {new Date(r.date).toLocaleDateString()} at {r.time}
              </p>

              {/* Existing review */}
              {myReview && !editingReview ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="md:flex justify-between items-start">
                    <div>
                      <p className="font-semibold mb-[8px]"> Review</p>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              myReview.rating > i
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-1">{myReview.comment}</p>
                    </div>
                    <div className="flex gap-2 md:mt-0 mt-[10px]">
                      <button
                        onClick={() => handleEdit(myReview)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(myReview._id, restaurantId)
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Photos */}
                  {myReview.photos?.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {myReview.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          // src={`http://localhost:3005/uploads/${photo}`}
                          src={`https://reservation-nodejs.onrender.com/uploads/${photo}`}
                          alt="review"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Manager reply */}
                  {myReview.ownerResponse && (
                    <p className="mt-3 text-sm text-blue-600 font-medium">
                      Manager Reply: {myReview.ownerResponse.text}
                    </p>
                  )}
                </div>
              ) : (
                // New or editing form
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold mb-2">
                    {editingReview ? "Edit your review" : "Leave a review"}
                  </p>

                  {/* Star rating input */}
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          formData.rating >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                      />
                    ))}
                  </div>

                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Write your review..."
                    className="border w-full p-2 rounded-lg mb-2"
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSubmit(restaurantId)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      {editingReview ? "Update" : "Submit"}
                    </button>
                    {editingReview && (
                      <button
                        onClick={() => {
                          setEditingReview(null);
                          setFormData({ rating: 5, comment: "" });
                          setPhotos([]);
                        }}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyReviews;