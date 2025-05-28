import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup interceptors
export const setupInterceptors = (handleLogout) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("Request config:", config);
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log("Response:", response);
      return response;
    },
    async (error) => {
      console.error("Response error:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);

        // Xử lý lỗi 401 (Unauthorized)
        if (error.response.status === 401) {
          handleLogout();
        }
      }
      return Promise.reject(error);
    }
  );
};

// Get Authorization Header
export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

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
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data.result;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách loại phòng"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại phòng:", error);
    throw error;
  }
}

export async function getAllRooms() {
  try {
    const response = await api.get("/api/rooms");

    if (response.status === 200 && response.data.code === 0) {
      return response.data.result;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách phòng"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    throw error;
  }
}

export async function getRoomById(roomId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.get(`/api/rooms/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy thông tin phòng"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phòng:", error);
    throw error;
  }
}

export async function addRoom(roomData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    // Tạo object dữ liệu phòng
    const roomRequest = {
      roomNumber: roomData.roomNumber,
      description: roomData.description,
      price: roomData.price, // Giá đã được format ở component
      type: roomData.type,
      capacity: parseInt(roomData.capacity),
      status: roomData.status
    };

    // Nếu có ảnh, tạo FormData
    if (roomData.photo) {
      const formData = new FormData();
      formData.append("photo", roomData.photo);
      // Thêm từng trường dữ liệu vào FormData
      Object.keys(roomRequest).forEach(key => {
        formData.append(key, roomRequest[key]);
      });

      const response = await api.post("/api/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } else {
      // Nếu không có ảnh, gửi JSON object
      const response = await api.post("/api/rooms", roomRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return response;
    }
  } catch (error) {
    console.error("Lỗi khi thêm phòng:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Status:", error.response.status);
    }
    throw error;
  }
}

export async function updateRoom(roomId, roomData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.put(`/api/rooms/${roomId}`, roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Không thể cập nhật phòng");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng:", error);
    throw error;
  }
}

export async function deleteRoom(roomId) {
  const response = await api.delete(`/rooms/delete/room/${roomId}`);
  return response.data;
}

export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  try {
    const response = await api.get(`/api/rooms/available`, {
      params: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        roomType: roomType,
      }
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách phòng trống"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng trống:", error);
    throw error;
  }
}

// Booking APIs
// Booking APIs
export async function bookRoom(roomId, bookingData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập.");
    }

    const requestData = {
      roomId: parseInt(roomId),
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      numberOfGuests: bookingData.numberOfGuests || 2,
      totalAmount: bookingData.totalAmount,
      specialRequests: bookingData.specialRequests,
    };

    const response = await api.post("/api/bookings", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    if (error.response?.data?.message) {
      // ✅ Server trả về mã lỗi cùng message (ví dụ: 400 + message custom)
      throw new Error(error.response.data.message);
    } else if (error.request) {
      // ✅ Request gửi đi nhưng không nhận được phản hồi từ server
      throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } else {
      // ✅ Các lỗi khác (ví dụ cấu hình request bị sai)
      throw new Error("Đã xảy ra lỗi trong quá trình gửi yêu cầu.");
    }
  }
}

export async function getAllBookings() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    console.log("Gọi API getAllBookings với token:", token);

    const response = await api.get("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response từ API getAllBookings:", response);

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách đặt phòng"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    if (error.response) {
      console.error("Response error:", error.response.data);
      console.error("Status:", error.response.status);
    }
    throw error;
  }
}

export async function deleteBooking(bookingId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.put(`/api/bookings/${bookingId}/cancel`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Không thể xóa đặt phòng");
    }
  } catch (error) {
    console.error("Lỗi khi xóa đặt phòng:", error);
    throw error;
  }
}

export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.get(`/api/bookings/code/${confirmationCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Không thể tìm thấy đặt phòng");
    }
  } catch (error) {
    console.error("Lỗi khi tìm đặt phòng:", error);
    throw error;
  }
}

export async function getMyBookings() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    const response = await api.get("/api/bookings/user/my", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách đặt phòng của bạn"
      );
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    throw error;
  }
}
