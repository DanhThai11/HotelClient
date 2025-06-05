import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../common/Header";

const BookingSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentStatus = params.get("paymentStatus");
  const billId = params.get("billId");
  const message = params.get("message"); // Có thể có message từ server

  // Xác định trạng thái thành công dựa vào paymentStatus từ URL
  const isSuccessful = paymentStatus === "success";

  // console.log("URL Search Params:", location.search); // Debugging line
  // console.log("Payment Status:", paymentStatus); // Debugging line
  // console.log("Bill ID:", billId); // Debugging line
  // console.log("Message from URL:", message); // Debugging line

  return (
    <div className="container">
      <Header title="Kết quả thanh toán" />
      <div className="mt-5">
        {isSuccessful ? (
          <div>
            <h3 className="text-success">Thanh toán thành công!</h3>
            {billId && (
              <p className="text-success">{`Mã hóa đơn của bạn là: ${billId}`}</p>
            )}
            {message && (
                 <p className="text-success">{message}</p>
            )}
             <p className="text-muted">Booking của bạn đã được xác nhận.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-danger">Thanh toán thất bại!</h3>
            {message ? (
              <p className="text-danger">{message}</p>
            ) : (
              // Hiển thị message mặc định khi thất bại
              <p className="text-danger">
                Đã xảy ra lỗi trong quá trình thanh toán.
              </p>
            )}
            {billId && (
                <p className="text-muted">Mã hóa đơn liên quan: {billId}</p>
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
