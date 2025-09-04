import Instance from "./instance";

export const authAPI = {
    // Auth endpoints
    register: (userData) => Instance.post('/api/auth/register', userData),
    login: (credentials) => Instance.post('/api/auth/login', credentials),
    logout: () => Instance.post('/api/auth/logout'),
    getProfile: () => Instance.get('/api/auth/myprofile'),

    // update profile 
    updateProfile: (data) => Instance.put("/api/users/me", data),
    
    // Password reset flow
    forgotPasswordData: (email) => Instance.post("/api/auth/forgetpassword", { email }),
    resetPassword: (token, newPassword) =>
        Instance.post(`/api/auth/resetpassword/${token}`, { password: newPassword })
}

export const restaurantAPI = {
    // Restaurant Endpoints
    getRestaurants: (params = {}) => Instance.get('/api/restaurants', { params }),
    getRestaurant: (id) => Instance.get(`/api/restaurants/${id}`),

      // Manager-specific
    getMyRestaurants: () => Instance.get("/api/restaurants/my"),

    createRestaurant: (restData) => Instance.post('/api/restaurants', restData),
    updateRestaurant: (id, restData) => Instance.put(`/api/restaurants/${id}`, restData),
    deleteRestaurant: (id) => Instance.delete(`/api/restaurants/${id}`),
    

    uploadPhotos: (id, formData) =>
        Instance.post(`/api/restaurants/${id}/photos`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),
    deletePhoto: (id, photoUrl) =>
        Instance.delete(`/api/restaurants/${id}/photos/${encodeURIComponent(photoUrl)}`),

    // Recommendation Endpoints
    getPersonalized: () => Instance.get('/api/recommendations/personalized'),
    getTrending: () => Instance.get('/api/recommendations/trending'),
};

export const reviewAPI = {
    getReviews: (restaurantId) => Instance.get(`/api/reviews/${restaurantId}`),
    createReview: (data) =>
        Instance.post("/api/reviews", data, {
            headers: { "Content-Type": "multipart/form-data" },
    }),
    updateReview: (id, data) =>
        Instance.put(`/api/reviews/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
    }),
    deleteReview: (id) => Instance.delete(`/api/reviews/${id}`),
}

export const reservationAPI = {
    createReservation: (data) => Instance.post("/api/reservations", data),
    getMyReservations: () => Instance.get("/api/reservations"),
    updateReservation: (reservationId, data) => Instance.put(`/api/reservations/${reservationId}`, data),
    cancelReservation: (reservationId) => Instance.delete(`/api/reservations/${reservationId}`),

    
    // Get reservations for a particular restaurant (for admin/owner)
    getRestaurantReservations: (restaurantId) =>
        Instance.get(`/api/reservations/restaurant/${restaurantId}`),
}

export const adminAPI = {
  // Restaurants
  getAllRestaurants: () => Instance.get("/api/admin/restaurants"),
  deleteRestaurant: (id) => Instance.delete(`/api/admin/restaurant/${id}`),

  // Reviews
  getAllReviews: () => Instance.get("/api/admin/reviews"),
  deleteReview: (id) => Instance.delete(`/api/admin/reviews/${id}`),

  // Reservations
  getAllReservations: () => Instance.get("/api/admin/reservations"),
  updateReservation: (reservationId, data) =>
    Instance.put(`/api/admin/reservations/${reservationId}`, data),
  cancelReservation: (reservationId) =>
    Instance.delete(`/api/admin/reservations/${reservationId}`),
};