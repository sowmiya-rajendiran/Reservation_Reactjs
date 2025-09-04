import { useState } from "react";

const RestaurantFilters = ({ restaurants, setFilteredRestaurants }) => {
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    location: "",
    priceRange: "",
    dietary: "",
    ambiance: "",
    specialFeatures: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    let filtered = [...restaurants];

    // Search by name
    if (filters.search) {
      filtered = filtered.filter((r) =>
        (r.name || "").toString().toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Cuisine
    if (filters.cuisine) {
      filtered = filtered.filter(
        (r) => (r.cuisine || "").toString().toLowerCase() === filters.cuisine.toLowerCase()
      );
    }

    // Location
    if (filters.location) {
      filtered = filtered.filter((r) =>
        (r.location || "").toString().toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price Range
    if (filters.priceRange) {
      filtered = filtered.filter((r) => (r.priceRange || "") === filters.priceRange);
    }

    // Dietary restrictions
    if (filters.dietary) {
      filtered = filtered.filter((r) =>
        (r.dietary || "").toString().toLowerCase().includes(filters.dietary.toLowerCase())
      );
    }

    // Ambiance
    if (filters.ambiance) {
      filtered = filtered.filter((r) =>
        (r.ambiance || "").toString().toLowerCase().includes(filters.ambiance.toLowerCase())
      );
    }

    // Special Features
    if (filters.specialFeatures) {
      filtered = filtered.filter((r) =>
        (r.specialFeatures || "").toString().toLowerCase().includes(filters.specialFeatures.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      cuisine: "",
      location: "",
      priceRange: "",
      dietary: "",
      ambiance: "",
      specialFeatures: "",
    });
    setFilteredRestaurants(restaurants); 
  };

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        name="search"
        placeholder="Search by name"
        value={filters.search}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* Cuisine */}
      <select
        name="cuisine"
        value={filters.cuisine}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">All Cuisines</option>
        <option value="indian">Indian</option>
        <option value="italian">Italian</option>
        <option value="chinese">Chinese</option>
        <option value="chinese">Seafood</option>
      </select>

      {/* Location */}
      <input
        type="text"
        name="location"
        placeholder="City"
        value={filters.location}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* Price Range */}
      <select
        name="priceRange"
        value={filters.priceRange}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Any Price</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>

      {/* Dietary Restrictions */}
      <select
        name="dietary"
        value={filters.dietary}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Any Dietary</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten Free</option>
      </select>

      {/* Ambiance */}
      <select
        name="ambiance"
        value={filters.ambiance}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Any Ambiance</option>
        <option value="casual">Casual</option>
        <option value="romantic">Romantic</option>
        <option value="family">Family Friendly</option>
      </select>

      {/* Special Features */}
      <select
        name="specialFeatures"
        value={filters.specialFeatures}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Any Feature</option>
        <option value="outdoor-seating">Outdoor Seating</option>
        <option value="live-music">Live Music</option>
        <option value="pet-friendly">Pet Friendly</option>
        <option value="wifi">Free WiFi</option>
      </select>

      {/* Buttons */}
      <button
        onClick={handleApply}
        className="bg-black text-white px-4 py-2 rounded w-full mb-2 cursor-pointer"
      >
        Apply
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-400 text-white px-4 py-2 rounded w-full cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
};

export default RestaurantFilters;