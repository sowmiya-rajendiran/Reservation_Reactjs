import { useState, useEffect } from "react";
import { restaurantAPI } from "../instances/endpoint";
import toast from "react-hot-toast";

const ManagerRestaurantEditor = ({ restaurant, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: { address: "", city: "", state: "", postalCode: "" },
    contact: {
      phone: "",
      email: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
    tableCapacity: "",
    cuisine: "",
    priceRange: "$$",
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    menu: [{ item: "", price: "" }],
    dietaryRestrictions: [],
    ambiance: "",
    features: [],
  });

  const [photos, setPhotos] = useState([]);

  // Pre-fill form if editing
  useEffect(() => {
    if (restaurant) {
      setFormData({
        ...restaurant,
        location: restaurant.location || {
          address: "",
          city: "",
          state: "",
          postalCode: "",
        },
        contact: restaurant.contact || {
          phone: "",
          email: "",
          website: "",
          facebook: "",
          instagram: "",
          twitter: "",
        },
        openingHours: restaurant.openingHours || {
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        },
        menu: restaurant.menu?.length ? restaurant.menu : [{ item: "", price: "" }],
      });
    }
  }, [restaurant]);

  // Handle simple/nested inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle menu update
  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...formData.menu];
    updatedMenu[index][field] = value;
    setFormData((prev) => ({ ...prev, menu: updatedMenu }));
  };

  const addMenuItem = () => {
    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu, { item: "", price: "" }],
    }));
  };

  // Handle photos
  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  // Input Validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Restaurant name is required");
      return false;
    }
    if (!formData.location.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.contact.phone.match(/^\d{10}$/)) {
      toast.error("Valid 10-digit phone number is required");
      return false;
    }
    if (formData.contact.email && !/\S+@\S+\.\S+/.test(formData.contact.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (formData.contact.website && !/^https?:\/\/.+\..+/.test(formData.contact.website)) {
      toast.error("Invalid website URL (must start with http/https)");
      return false;
    }
    if (!formData.tableCapacity || formData.tableCapacity <= 0) {
      toast.error("Table capacity must be a positive number");
      return false;
    }
    if (!formData.cuisine.trim()) {
      toast.error("Cuisine is required");
      return false;
    }
    for (let i = 0; i < formData.menu.length; i++) {
      const m = formData.menu[i];
      if (!m.item.trim() || !m.price || m.price <= 0) {
        toast.error(`Menu item ${i + 1} must have a name and valid price`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let res;
      if (restaurant && restaurant._id) {
        // update existing
        res = await restaurantAPI.updateRestaurant(restaurant._id, formData);
        toast.success("Restaurant updated successfully!");
      } else {
        // create new
        res = await restaurantAPI.createRestaurant(formData);
        toast.success("Restaurant created successfully!");
      }

      // upload photos if any
      if (photos.length > 0) {
        const formDataPhotos = new FormData();
        photos.forEach((p) => formDataPhotos.append("photos", p));
        await restaurantAPI.uploadPhotos(res.data._id, formDataPhotos);
      }

      if (onSaved) onSaved(res.data);
    } catch (err) {
      console.error("Error saving restaurant:", err);
      toast.error("Failed to save restaurant");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {restaurant && restaurant._id ? "Edit Restaurant" : "Create Restaurant"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Location */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location?.address || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location?.city || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location.state"
            placeholder="State"
            value={formData.location?.state || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="location.postalCode"
            placeholder="Postal Code"
            value={formData.location?.postalCode || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        {/* Contact */}
        <input
          type="text"
          name="contact.phone"
          placeholder="Phone"
          value={formData.contact?.phone || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="contact.email"
          placeholder="Email"
          value={formData.contact?.email || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="contact.website"
          placeholder="Website"
          value={formData.contact?.website || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Social Links */}
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            name="contact.facebook"
            placeholder="Facebook"
            value={formData.contact?.facebook || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="contact.instagram"
            placeholder="Instagram"
            value={formData.contact?.instagram || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="contact.twitter"
            placeholder="Twitter"
            value={formData.contact?.twitter || ""}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Capacity, Cuisine, Price */}
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            name="tableCapacity"
            placeholder="Table Capacity"
            value={formData.tableCapacity || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="cuisine"
            placeholder="Cuisine"
            value={formData.cuisine || ""}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="priceRange"
            value={formData.priceRange || "$$"}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>
        </div>

        {/* Opening Hours */}
        <h3 className="font-semibold mt-2">Opening Hours</h3>
        {Object.keys(formData.openingHours).map((day) => (
          <input
            key={day}
            type="text"
            name={`openingHours.${day}`}
            placeholder={`${day} hours`}
            value={formData.openingHours?.[day] || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-1"
          />
        ))}

        {/* Menu */}
        <h3 className="font-semibold mt-2">Menu Items</h3>
        {formData.menu.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              placeholder="Item"
              value={m.item || ""}
              onChange={(e) => handleMenuChange(i, "item", e.target.value)}
              className="p-2 border rounded w-2/3"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={m.price || ""}
              onChange={(e) => handleMenuChange(i, "price", e.target.value)}
              className="p-2 border rounded w-1/3"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addMenuItem}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          + Add Item
        </button>

        {/* Ambiance */}
        <input
          type="text"
          name="ambiance"
          placeholder="Ambiance (e.g. casual, romantic)"
          value={formData.ambiance || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Photos */}
        <input
          type="file"
          multiple
          onChange={handlePhotoUpload}
          className="w-full"
        />

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Restaurant
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerRestaurantEditor;