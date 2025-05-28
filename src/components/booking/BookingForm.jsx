import React, { useEffect } from "react";
import moment from "moment";
import { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import BookingSummary from "./BookingSummary";
import { bookRoom, getRoomById } from "../utils/ApiFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const BookingForm = () => {
  const [validated, setValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentUser = localStorage.getItem("userId");

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    specialRequests: "",
    totalAmount: 0,
  });

  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      if (response.code === 0 && response.result) {
        setRoomPrice(response.result.price);
        console.log("Room price:", response.result.price); // Debug log
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching room price:", error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculatePayment = () => {
    if (!booking.checkInDate || !booking.checkOutDate || !roomPrice) {
      return 0;
    }

    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);

    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      return 0;
    }

    const diffInDays = checkOutDate.diff(checkInDate, "days");
    if (diffInDays <= 0) {
      return 0;
    }

    return diffInDays * roomPrice;
  };

  useEffect(() => {
    const totalAmount = calculatePayment();
    setBooking((prev) => ({ ...prev, totalAmount }));
  }, [booking.checkInDate, booking.checkOutDate, roomPrice]);

  const isCheckOutDateValid = () => {
    if (!booking.checkInDate || !booking.checkOutDate) {
      return false;
    }

    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);

    if (!checkIn.isValid() || !checkOut.isValid()) {
      setErrorMessage("Ngày không hợp lệ");
      setSuccessMessage("");
      return false;
    }

    if (checkOut.isSameOrBefore(checkIn)) {
      setErrorMessage("Ngày check-out phải sau ngày check-in");
      setSuccessMessage("");
      return false;
    }

      setErrorMessage("");
      setSuccessMessage("");
      return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || !isCheckOutDateValid()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Form hợp lệ, hiển thị BookingSummary
    setValidated(true);
    setIsSubmitted(true);
  };

  const handleFormSubmit = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage("");
      setSuccessMessage("");

      const bookingData = {
        ...booking,
        checkInDate: moment(booking.checkInDate).format("YYYY-MM-DDTHH:mm:ss"),
        checkOutDate: moment(booking.checkOutDate).format("YYYY-MM-DDTHH:mm:ss")
      };

      // Gọi API đặt phòng
      const response = await bookRoom(roomId, bookingData);
      
      if (response.data?.code === 0) {
        // Đặt phòng thành công, chỉ điều hướng và truyền state
        const successState = { message: response.data?.message, roomId: response.data?.result?.id };
        console.log("Navigating with state:", successState);
        
        // Thực hiện điều hướng và thoát hàm
        navigate("/booking-success", { state: successState });
        return; // Thêm return để dừng thực thi further code

      } else {
        // Server trả về lỗi (phòng đã đặt, vv.)
        setErrorMessage(response.data?.message || "Không thể đặt phòng.");
        setSuccessMessage("");
        setIsSubmitted(false);
        setValidated(false);
      }
    } catch (error) {
      // Xử lý lỗi network hoặc lỗi khác
      setErrorMessage(error.message || "Đã xảy ra lỗi khi đặt phòng.");
      setSuccessMessage("");
      setIsSubmitted(false);
      setValidated(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-body mt-5">
              <h4 className="card-title">Reserve Room</h4>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {errorMessage}
                </div>
              )}

              {/* Hiển thị form hoặc BookingSummary */}
              {/* Hiển thị form */}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="guestFullName" className="hotel-color">
                    Fullname
                  </Form.Label>
                  <FormControl
                    required
                    type="text"
                    id="guestFullName"
                    name="guestFullName"
                    value={booking.guestFullName}
                    placeholder="Enter your fullname"
                    onChange={handleInputChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your fullname.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="guestEmail" className="hotel-color">
                    Email
                  </Form.Label>
                  <FormControl
                    required
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={booking.guestEmail}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    // disabled
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>

                <fieldset style={{ border: "2px" }}>
                  <legend>Lodging Period</legend>
                  <div className="row">
                    <div className="col-6">
                      <Form.Label htmlFor="checkInDate" className="hotel-color">
                        Check-in date
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={booking.checkInDate}
                        placeholder="check-in-date"
                        min={moment().format("YYYY-MM-DD")}
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check in date.
                      </Form.Control.Feedback>
                    </div>

                    <div className="col-6">
                      <Form.Label
                        htmlFor="checkOutDate"
                        className="hotel-color"
                      >
                        Check-out date
                      </Form.Label>
                      <FormControl
                        required
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={booking.checkOutDate}
                        placeholder="check-out-date"
                        min={
                          booking.checkInDate || moment().format("YYYY-MM-DD")
                        }
                        onChange={handleInputChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please select a check out date.
                      </Form.Control.Feedback>
                      </div>
                      {/* errorMessage ở đây đã được hiển thị ở trên */}
                      {/* {errorMessage && ( ... )} */}
                    </div>
                  </fieldset>

                  <fieldset style={{ border: "2px" }}>
                    <legend>Special Requests</legend>
                    <div className="row">
                      <div className="col-12">
                        <Form.Label
                          htmlFor="specialRequests"
                          className="hotel-color"
                        >
                          Ghi chú
                        </Form.Label>
                        <FormControl
                          as="textarea"
                          rows={3}
                          id="specialRequests"
                          name="specialRequests"
                          value={booking.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Nhập yêu cầu đặc biệt của bạn (nếu có)"
                        />
                      </div>
                    </div>
                  </fieldset>

                  <div className="fom-group mt-2 mb-2">
                    <button
                      type="submit"
                      className="btn btn-hotel"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Đang xử lý...
                        </>
                      ) : (
                        "Tiếp tục"
                      )}
                    </button>
                  </div>
                </Form>
            </div>
          </div>

          {/* Cột bên phải chứa BookingSummary */}
          <div className="col-md-4">
            {/* Hiển thị BookingSummary nếu đã submitted và không có lỗi */}
            {isSubmitted && !errorMessage && (
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                onConfirm={handleFormSubmit}
                isFormValid={validated}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
