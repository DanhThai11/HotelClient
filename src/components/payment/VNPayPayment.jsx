import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createVNPayPayment } from "../utils/ApiFunctions";
import { toast } from "react-toastify";

const VNPayPayment = ({ billId, amount, onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra nếu có tham số paymentStatus từ URL (callback từ VNPay)
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("paymentStatus");
    const message = params.get("message");

    if (paymentStatus) {
      if (paymentStatus === "success") {
        toast.success("Thanh toán thành công!");
        if (onPaymentComplete) {
          onPaymentComplete(true);
        }
      } else {
        toast.error(message || "Thanh toán thất bại!");
        if (onPaymentComplete) {
          onPaymentComplete(false);
        }
      }
    }
  }, [location, onPaymentComplete]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await createVNPayPayment(billId, amount);

      if (response.code === 0 && response.result) {
        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.result;
      } else {
        toast.error("Không thể tạo URL thanh toán");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <button
        className="btn btn-primary"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Đang xử lý...
          </>
        ) : (
          "Thanh toán qua VNPay"
        )}
      </button>
    </div>
  );
};

export default VNPayPayment;
