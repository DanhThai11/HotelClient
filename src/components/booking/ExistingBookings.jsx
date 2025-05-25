import React, { useState, useEffect } from "react";
import { getAllBookings, deleteBooking } from "../../components/utils/ApiFunctions";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ExistingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      if (response.code === 0) {
        setBookings(response.result);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách đặt phòng</h1>
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
    </div>
  );
};

export default ExistingBookings; 