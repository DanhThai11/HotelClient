import { parseISO } from "date-fns";
import React, { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
  const [filteredBookings, setFilteredBookings] = useState([]);

    const filterBookings = (startDate, endDate) => {
    if (!bookingInfo?.result || !Array.isArray(bookingInfo.result)) {
      console.error("Invalid booking data:", bookingInfo);
      return;
    }

    let filtered = bookingInfo.result;
        if (startDate && endDate) {
      filtered = bookingInfo.result.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                );
            });
        }
    // Sắp xếp: CANCELLED xuống dưới, các trạng thái khác giữ nguyên thứ tự
    filtered.sort((a, b) => {
      if (a.status === "CANCELLED" && b.status !== "CANCELLED") return 1;
      if (a.status !== "CANCELLED" && b.status === "CANCELLED") return -1;
      return 0;
    });
        setFilteredBookings(filtered);
    };

    useEffect(() => {
    if (bookingInfo?.result && Array.isArray(bookingInfo.result)) {
      // Sắp xếp khi khởi tạo dữ liệu
      const sortedBookings = [...bookingInfo.result].sort((a, b) => {
        if (a.status === "CANCELLED" && b.status !== "CANCELLED") return 1;
        if (a.status !== "CANCELLED" && b.status === "CANCELLED") return -1;
        return 0;
      });
      setFilteredBookings(sortedBookings);
    } else {
      console.error("Invalid booking data:", bookingInfo);
      setFilteredBookings([]);
    }
    }, [bookingInfo]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (!Array.isArray(filteredBookings)) {
    console.error("filteredBookings is not an array:", filteredBookings);
    return (
      <div className="alert alert-danger">
        Có lỗi xảy ra khi tải dữ liệu đặt phòng
      </div>
    );
  }

    return (
        <section className="bookings-table-container">
      <DateSlider
        onDateChange={filterBookings}
        onFilterChange={filterBookings}
      />
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
              <th>STT</th>
              <th>Số phòng</th>
              <th>UserId</th>
              <th>Tên người đặt</th>
              <th>Loại phòng</th>
              <th>Ngày nhận phòng</th>
              <th>Ngày trả phòng</th>
              <th>Số khách</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking, index) => (
                            <tr key={booking.id}>
                                <td>{index + 1}</td>
                <td>{booking.roomNumber || "N/A"}</td>
                <td>{booking.user?.id || "N/A"}</td>
                <td>{booking.user?.username || "N/A"}</td>
                <td>{booking.roomType}</td>
                <td>{formatDate(booking.checkInDate)}</td>
                <td>{formatDate(booking.checkOutDate)}</td>
                <td>{booking.numberOfGuests}</td>
                <td>{booking.totalAmount?.toLocaleString("vi-VN")} VNĐ</td>
                <td>
                  <span
                    className={`badge ${
                      booking.status === "CONFIRMED"
                        ? "bg-success"
                        : booking.status === "PENDING"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {booking.status === "CONFIRMED"
                      ? "Đã xác nhận"
                      : booking.status === "PENDING"
                      ? "Đang chờ"
                      : "Đã hủy"}
                  </span>
                </td>
                <td>{booking.specialRequests || "Không có"}</td>
                                <td>
                  {booking.status === "PENDING" && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleBookingCancellation(booking.id)}
                                    >
                      Hủy
                                    </button>
                  )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
          <p className="no-booking-message">
            Không tìm thấy đặt phòng nào trong khoảng thời gian đã chọn
          </p>
                )}
            </div>
        </section>
    );
};

export default BookingsTable;
