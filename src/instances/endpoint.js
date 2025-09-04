import Instance from "./instance";

export const authAPI = {
    // Auth endpoints
    register: (userData) => Instance.post('/auth/register', userData),
    login: (credentials) => Instance.post('/auth/login', credentials),
    logout: () => Instance.post('/auth/logout'),
    getProfile: () => Instance.get('/auth/myprofile'),

    // update profile 
    updateProfile: (data) => Instance.put("/users/me", data),
    
    // Password reset flow
    forgotPasswordData: (email) => Instance.post("/auth/forgetpassword", { email }),
    resetPassword: (token, newPassword) =>
        Instance.post(`/auth/resetpassword/${token}`, { password: newPassword })
}

export const restaurantAPI = {
    // Restaurant Endpoints
    getRestaurants: (params = {}) => Instance.get('/restaurants', { params }),
    getRestaurant: (id) => Instance.get(`/restaurants/${id}`),

      // Manager-specific
    getMyRestaurants: () => Instance.get("/restaurants/my"),

    createRestaurant: (restData) => Instance.post('/restaurants', restData),
    updateRestaurant: (id, restData) => Instance.put(`/restaurants/${id}`, restData),
    deleteRestaurant: (id) => Instance.delete(`/restaurants/${id}`),
    

    uploadPhotos: (id, formData) =>
        Instance.post(`/restaurants/${id}/photos`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),
    deletePhoto: (id, photoUrl) =>
        Instance.delete(`/restaurants/${id}/photos/${encodeURIComponent(photoUrl)}`),

    // Recommendation Endpoints
    getPersonalized: () => Instance.get('/recommendations/personalized'),
    getTrending: () => Instance.get('/recommendations/trending'),
};

export const reviewAPI = {
    getReviews: (restaurantId) => Instance.get(`/reviews/${restaurantId}`),
    createReview: (data) =>
        Instance.post("/reviews", data, {
            headers: { "Content-Type": "multipart/form-data" },
    }),
    updateReview: (id, data) =>
        Instance.put(`/reviews/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
    }),
    deleteReview: (id) => Instance.delete(`/reviews/${id}`),
}

export const reservationAPI = {
    createReservation: (data) => Instance.post("/reservations", data),
    getMyReservations: () => Instance.get("/reservations"),
    updateReservation: (reservationId, data) => Instance.put(`/reservations/${reservationId}`, data),
    cancelReservation: (reservationId) => Instance.delete(`/reservations/${reservationId}`),

    
    // Get reservations for a particular restaurant (for admin/owner)
    getRestaurantReservations: (restaurantId) =>
        Instance.get(`/reservations/restaurant/${restaurantId}`),
}

export const adminAPI = {
  // Restaurants
  getAllRestaurants: () => Instance.get("/admin/restaurants"),
  deleteRestaurant: (id) => Instance.delete(`/admin/restaurant/${id}`),

  // Reviews
  getAllReviews: () => Instance.get("/admin/reviews"),
  deleteReview: (id) => Instance.delete(`/admin/reviews/${id}`),

  // Reservations
  getAllReservations: () => Instance.get("/admin/reservations"),
  updateReservation: (reservationId, data) =>
    Instance.put(`/admin/reservations/${reservationId}`, data),
  cancelReservation: (reservationId) =>
    Instance.delete(`/admin/reservations/${reservationId}`),
};