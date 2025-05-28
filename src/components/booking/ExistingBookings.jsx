import React, { useState, useEffect } from "react";
import { getAllBookings, deleteBooking, api } from "../../components/utils/ApiFunctions";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExistingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra token trước khi fetch
    const token = localStorage.getItem("token");
    console.log("Token hiện tại:", token);
    if (!token) {
      setError("Vui lòng đăng nhập để xem danh sách đặt phòng");
      setLoading(false);
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Bắt đầu fetch dữ liệu...");
      
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      // Gọi API trực tiếp với token
      const response = await api.get("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("API Response:", response);
      
      if (!response) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      if (response.status === 200 && response.data.code === 0) {
        const bookingData = response.data.result;
        if (Array.isArray(bookingData)) {
          console.log("Dữ liệu hợp lệ, số lượng booking:", bookingData.length);
          setBookings(bookingData);
        } else {
          console.log("Dữ liệu không phải mảng:", bookingData);
          setBookings([]);
          setError("Định dạng dữ liệu không hợp lệ");
        }
      } else {
        console.log("API trả về lỗi:", response.data.message);
        setError(response.data.message || "Có lỗi xảy ra khi tải danh sách đặt phòng");
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Status:", error.response.status);
      }
      setError(error.message || "Có lỗi xảy ra khi tải danh sách đặt phòng");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("State bookings đã thay đổi:", bookings);
    console.log("State loading:", loading);
    console.log("State error:", error);
  }, [bookings, loading, error]);

  const handleDelete = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đặt phòng này?")) {
      try {
        const response = await deleteBooking(bookingId);
        if (response.code === 0) {
          toast.success("Xóa đặt phòng thành công!");
          fetchBookings();
        } else {
          toast.error(response.message || "Xóa đặt phòng thất bại");
        }
      } catch (error) {
        toast.error(error.message || "Có lỗi xảy ra khi xóa đặt phòng");
      }
    }
  };

  const handleEdit = (bookingId) => {
    navigate(`/edit-booking/${bookingId}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách đặt phòng</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-4">
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          <p>Không có dữ liệu đặt phòng</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 border-b text-left">ID</th>
                <th className="px-6 py-3 border-b text-left">Người đặt</th>
                <th className="px-6 py-3 border-b text-left">Số phòng</th>
                <th className="px-6 py-3 border-b text-left">Loại phòng</th>
                <th className="px-6 py-3 border-b text-left">Ngày nhận phòng</th>
                <th className="px-6 py-3 border-b text-left">Ngày trả phòng</th>
                <th className="px-6 py-3 border-b text-left">Số khách</th>
                <th className="px-6 py-3 border-b text-left">Tổng tiền</th>
                <th className="px-6 py-3 border-b text-left">Trạng thái</th>
                <th className="px-6 py-3 border-b text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{booking.id}</td>
                  <td className="px-6 py-4 border-b">{booking.user.username}</td>
                  <td className="px-6 py-4 border-b">{booking.roomNumber}</td>
                  <td className="px-6 py-4 border-b">{booking.roomType}</td>
                  <td className="px-6 py-4 border-b">
                    {formatDate(booking.checkInDate)}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="px-6 py-4 border-b">{booking.numberOfGuests}</td>
                  <td className="px-6 py-4 border-b">
                    {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td className="px-6 py-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(booking.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExistingBookings; 