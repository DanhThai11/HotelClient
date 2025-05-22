import React from "react";
import { useLocation, Link } from "react-router-dom";

const VerifyEmailNotice = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";

  return (
    <section className="container col-8 mt-5 mb-5 text-center">
      <div className="alert alert-info p-4 shadow-sm rounded">
        <h3 className="mb-3">📧 Xác thực email</h3>
        <p>
          Mã xác minh và liên kết kích hoạt tài khoản đã được gửi đến địa chỉ
          email <strong>{email}</strong>.
        </p>
        <p>
          Vui lòng kiểm tra hộp thư đến hoặc mục <em>Spam / Junk</em> để hoàn
          tất quá trình xác thực.
        </p>
        <p className="mt-4">
          Sau khi xác thực, bạn có thể{" "}
          <Link to="/login" className="btn btn-primary btn-sm ms-2">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  );
};

export default VerifyEmailNotice;
