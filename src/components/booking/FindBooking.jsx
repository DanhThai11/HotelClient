import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBookings,
  deleteBooking,
  getBookingByConfirmationCode,
} from "../../components/utils/ApiFunctions";
import { FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBookingInfo(null);

    try {
      const response = await getBookingByConfirmationCode(confirmationCode);
      if (response.code === 0) {
        setBookingInfo(response.result);
      } else {
        setError(response.message || "Không tìm thấy đặt phòng");
      }
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi tìm đặt phòng");
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
          setBookingInfo(null);
          setConfirmationCode("");
        } else {
          toast.error(response.message || "Xóa đặt phòng thất bại");
        }
      } catch (error) {
        toast.error(error.message || "Có lỗi xảy ra khi xóa đặt phòng");
      }
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tìm đặt phòng</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Nhập mã xác nhận"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            disabled={loading}
          >
            <FaSearch />
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}

      {bookingInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Thông tin đặt phòng</h2>
            <button
              onClick={() => handleDelete(bookingInfo.id)}
              className="text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Mã xác nhận:</p>
              <p>{bookingInfo.id}</p>
            </div>
            <div>
              <p className="font-semibold">Người đặt:</p>
              <p>{bookingInfo.user.username}</p>
            </div>
            <div>
              <p className="font-semibold">Số phòng:</p>
              <p>{bookingInfo.roomNumber}</p>
            </div>
            <div>
              <p className="font-semibold">Loại phòng:</p>
              <p>{bookingInfo.roomType}</p>
            </div>
            <div>
              <p className="font-semibold">Ngày nhận phòng:</p>
              <p>{formatDate(bookingInfo.checkInDate)}</p>
            </div>
            <div>
              <p className="font-semibold">Ngày trả phòng:</p>
              <p>{formatDate(bookingInfo.checkOutDate)}</p>
            </div>
            <div>
              <p className="font-semibold">Số khách:</p>
              <p>{bookingInfo.numberOfGuests}</p>
            </div>
            <div>
              <p className="font-semibold">Tổng tiền:</p>
              <p>{bookingInfo.totalAmount.toLocaleString("vi-VN")} VNĐ</p>
            </div>
            <div>
              <p className="font-semibold">Trạng thái:</p>
              <p>{bookingInfo.status}</p>
            </div>
            {bookingInfo.specialRequests && (
              <div>
                <p className="font-semibold">Yêu cầu đặc biệt:</p>
                <p>{bookingInfo.specialRequests}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindBooking;
