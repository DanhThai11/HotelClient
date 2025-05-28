import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../common/Header";

const BookingSuccess = () => {
  const location = useLocation();
  const message = location.state?.message;
  const error = location.state?.error;
  const roomId = location.state?.roomId;

  console.log("Location state:", location.state); // <--- Thêm dòng này

  // Xác định trạng thái thành công dựa vào sự tồn tại của roomId
  const isBookingSuccessful = !!roomId;

  return (
    <div className="container">
      <Header title="Kết quả đặt phòng" />
      <div className="mt-5">
        {isBookingSuccessful ? (
          <div>
            <h3 className="text-success">Đặt phòng thành công!</h3>
            {roomId ? (
              <p className="text-success">{`Bạn đã đặt phòng thành công. Mã đặt phòng của bạn là: ${roomId}`}</p>
            ) : (
              // Fallback message nếu không có roomId nhưng vẫn coi là thành công (ít khả năng xảy ra)
              <p className="text-success">
                {message || "Đặt phòng thành công."}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-danger">Đặt phòng thất bại!</h3>
            {error ? (
              <p className="text-danger">{error}</p>
            ) : (
              // Hiển thị message từ server hoặc message mặc định khi thất bại
              <p className="text-danger">
                {message || "Đã xảy ra lỗi khi đặt phòng."}
              </p>
            )}
          </div>
        )}
        <div className="text-center">
          <Link to={"/"} className="btn btn-primary mt-3">
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
