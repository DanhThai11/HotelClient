import React, { useEffect, useState } from "react";
import { getMyBookings, getUser, deleteUser } from "../utils/ApiFunctions";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    roles: [], // ← là mảng chuỗi, không phải object
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = await getUser(token);
        console.log("User roles:", userData.roles); // 👈 kiểm tra ở đây
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user info:", error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getMyBookings(token);
        setBookings(response.result); // Lấy dữ liệu từ trường "result" trong response
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchBookings();
  }, [token]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      await deleteUser(userId)
        .then((response) => {
          setMessage(response.data);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userRole");
          navigate("/");
          window.location.reload();
        })
        .catch((error) => {
          setErrorMessage(error.data);
        });
    }
  };

  return (
    <div className="container">
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {message && <p className="text-danger">{message}</p>}
      {user ? (
        <div
          className="card p-5 mt-5"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <h4 className="card-title text-center">Thông Tin Người Dùng</h4>
          <div className="card-body">
            <div className="col-md-10 mx-auto">
              <div className="card mb-3 shadow">
                <div className="row g-0">
                  <div className="col-md-2">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <img
                        src="https://themindfulaimanifesto.org/wp-content/uploads/2020/09/male-placeholder-image.jpeg"
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label className="col-md-3 col-form-label fw-bold">
                      ID:
                    </label>
                    <div className="col-md-9">
                      <p className="card-text">{user.id}</p>
                    </div>
                  </div>
                  <hr />

                  <div className="form-group row">
                    <label className="col-md-3 col-form-label fw-bold">
                      Họ và Tên:
                    </label>
                    <div className="col-md-9">
                      <p className="card-text">{user.fullName}</p>
                    </div>
                  </div>
                  <hr />

                  <div className="form-group row align-items-center">
                    <label className="col-md-3 col-form-label fw-bold">
                      Số Điện Thoại:
                    </label>
                    <div className="col-md-9 d-flex align-items-center">
                      <p className="card-text mb-0">{user.phoneNumber}</p>
                    </div>
                  </div>
                  <hr />

                  <div className="form-group row">
                    <label className="col-md-3 col-form-label fw-bold">
                      Email:
                    </label>
                    <div className="col-md-9">
                      <p className="card-text">{user.email}</p>
                    </div>
                  </div>
                  <hr />

                  <div className="form-group row">
                    <label className="col-md-3 col-form-label fw-bold">
                      Vai Trò:
                    </label>
                    <div className="col-md-9">
                      <ul className="list-unstyled">
                        {user.roles.map((role, index) => (
                          <li key={index} className="card-text">
                            {role}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="card-title text-center">Lịch Sử Đặt Phòng</h4>

              {bookings.length > 0 ? (
                <table className="table table-bordered table-hover shadow">
                  <thead>
                    <tr>
                      <th scope="col">Mã Đặt Phòng</th>
                      <th scope="col">Mã Phòng</th>
                      <th scope="col">Số Phòng</th>
                      <th scope="col">Loại Phòng</th>
                      <th scope="col">Ngày Nhận Phòng</th>
                      <th scope="col">Ngày Trả Phòng</th>
                      <th scope="col">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>{booking.id}</td>
                        <td>{booking.roomId}</td>
                        <td>{booking.roomNumber}</td>
                        <td>{booking.roomType}</td>
                        <td>
                          {moment(booking.checkInDate)
                            .subtract(1, "month")
                            .format("MMM Do, YYYY")}
                        </td>
                        <td>
                          {moment(booking.checkOutDate)
                            .subtract(1, "month")
                            .format("MMM Do, YYYY")}
                        </td>
                        <td className="text-success">Đang sử dụng</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Bạn chưa có đặt phòng nào.</p>
              )}

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="primary"
                  className="btn-hotel"
                  onClick={() => navigate('/change-password')}
                >
                  Đổi Mật Khẩu
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                >
                  Xóa Tài Khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
};

export default Profile;
