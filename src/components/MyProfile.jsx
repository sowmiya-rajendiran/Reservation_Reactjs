import { useEffect, useState } from "react";
import { authAPI } from "../instances/endpoint";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const MyProfile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        const user = res.data.user;

        const userData = {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        };

        setForm(userData);
        setOriginalForm(userData);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Main button click (edit → save)
  const handleButtonClick = async () => {
    if (!isEditing) {
      // Enable editing
      setIsEditing(true);
    } else {
      // Save changes
      setSaving(true);
      try {
        const res = await authAPI.updateProfile(form);
        console.log("Profile updated:", res.data);

        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setOriginalForm(form);

        // Redirect after success
        navigate("/userdashboard");
      } catch (err) {
        console.error("Update failed", err.response?.data || err.message);
        toast.error("Failed to update profile");
      } finally {
        setSaving(false);
      }
    }
  };

  // Cancel reset
  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <>
        <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <button className="text-black font-semibold px-[15px] py-[7px] rounded bg-white cursor-pointer"
                onClick={() => navigate(-1)}
            >Back</button>

        </div>
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-md mt-[60px]">

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border px-3 py-2 rounded-md"
                />
                </div>

                <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border px-3 py-2 rounded-md"
                />
                </div>

                <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border px-3 py-2 rounded-md"
                />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    disabled={saving}
                    className={`px-4 py-2 rounded-md text-white ${
                    isEditing
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
                </button>

                {isEditing && (
                    <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                    Cancel
                    </button>
                )}
                </div>
            </form>
        </div>
    </>
   
  );
};

export default MyProfile;