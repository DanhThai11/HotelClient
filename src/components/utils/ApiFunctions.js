import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Get Authorization Header
export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Setup interceptors — call only after login
export const setupInterceptors = (handleLogout) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        localStorage.getItem("authToken")
      ) {
        originalRequest._retry = true;
        try {
          const newToken = await refreshToken();
          localStorage.setItem("authToken", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          handleLogout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

// Refresh token
export const refreshToken = async () => {
  const token = localStorage.getItem("token"); // Lấy token hiện tại
  if (!token) throw new Error("No token found");

  try {
    const response = await api.post("/auth/refresh", {
      token: token, // <-- Truyền token trong body
    });

    if (response.status === 200 && response.data.result?.token) {
      return response.data.result.token; // Trả về token mới
    } else {
      throw new Error("Invalid refresh response format");
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// User authentication
export async function loginUser(loginData) {
  const response = await api.post("/auth/token", loginData);
  if (response.status === 200) {
    const token = response.data;
    localStorage.setItem("token", token);
    return token;
  } else {
    throw new Error("Invalid login");
  }
}

export async function registerUser(registration) {
  const response = await api.post("/users", registration);
  return response.data;
}

export const logoutUser = async (token) => {
  try {
    const response = await api.post(
      "/auth/logout",
      token, // Gửi token vào API dưới dạng body
      { headers: { Authorization: `Bearer ${token}` } } // Gửi token trong header nếu cần
    );

    if (response.status === 200) {
      // Nếu logout thành công, bạn có thể xử lý gì đó như xóa token khỏi localStorage, context, vv.
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
    }
  } catch (error) {
    console.error("Logout error", error);
    // Xử lý lỗi logout nếu cần
  }
};

// User Info
export async function getUser(token) {
  const response = await fetch("http://localhost:8080/users/myInfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch user");
  const data = await response.json();
  return data.result;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/users/profile/${userId}`, {
    headers: getHeader(),
  });
  return response.data;
}

export async function deleteUser(userId) {
  const response = await api.delete(`/users/delete/${userId}`, {
    headers: getHeader(),
  });
  return response.data;
}

// Room APIs
export async function getRoomTypes() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.get("/api/rooms/types", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || "Không thể lấy danh sách loại phòng");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại phòng:", error);
    throw error;
  }
}

export async function getAllRooms() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.get("/api/rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || "Không thể lấy danh sách phòng");
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    throw error;
  }
}

export async function getRoomById(roomId) {
  const response = await api.get(`/rooms/room/${roomId}`);
  return response.data;
}

export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);
  const response = await api.post("/rooms/add/new-room", formData);
  return response.status === 201;
}

export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  const response = await api.put(`/rooms/update/${roomId}`, formData);
  return response.data;
}

export async function deleteRoom(roomId) {
  const response = await api.delete(`/rooms/delete/room/${roomId}`);
  return response.data;
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const response = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  return response.data;
}

// Booking APIs
export async function bookRoom(roomId, bookingData) {
  const response = await api.post(
    `/bookings/room/${roomId}/booking`,
    bookingData
  );
  return response.data;
}

export async function getAllBookings() {
  const response = await api.get("/bookings/all-bookings");
  return response.data;
}

export async function getBookingByConfirmationCode(confirmationCode) {
  const response = await api.get(`/bookings/confirmation/${confirmationCode}`);
  return response.data;
}

export async function cancelBooking(bookingId) {
  const response = await api.delete(`/bookings/booking/${bookingId}/delete`);
  return response.data;
}

export async function getMyBookings(token) {
  const response = await api.get("/api/bookings/user/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Change Password
export async function changePassword(oldPassword, newPassword) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.post(
      "/auth/changePass",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Đổi mật khẩu thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    throw error;
  }
}

// Hàm helper để xử lý đường dẫn ảnh
export function getRoomImageUrl(imagePath) {
  if (!imagePath) {
    return "https://via.placeholder.com/300x200?text=No+Image"; // Ảnh placeholder khi không có ảnh
  }
  
  // Nếu đường dẫn đã là URL đầy đủ
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Nếu đường dẫn bắt đầu bằng /uploads/rooms/
  if (imagePath.startsWith('/uploads/rooms/')) {
    return `${api.defaults.baseURL}${imagePath}`;
  }
  
  // Trường hợp khác, thêm /uploads/rooms/ vào trước
  return `${api.defaults.baseURL}/uploads/rooms/${imagePath}`;
}
