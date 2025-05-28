import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";

const BookingSummary = ({ booking, payment, isFormValid, onConfirm, isProcessing }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const numberOfDays = checkOutDate.diff(checkInDate, "days");

  const isDateValid = () => {
    return checkOutDate.isAfter(checkInDate);
  };

  return (
    <div className="row">
      <div className="col-md-6"></div>
      <div className="card card-body mt-5">
        <h4 className="card-title hotel-color">Reservation Summary</h4>
        <p>
          Name: <strong>{booking.guestFullName}</strong>
        </p>
        <p>
          Email: <strong>{booking.guestEmail}</strong>
        </p>
        <p>
          Check-in Date:{" "}
          <strong>{moment(booking.checkInDate).format("MMM Do YYYY")}</strong>
        </p>
        <p>
          Check-out Date:{" "}
          <strong>{moment(booking.checkOutDate).format("MMM Do YYYY")}</strong>
        </p>
        <p>
          Number of Days Booked: <strong>{numberOfDays}</strong>
        </p>

        <div>
          <h5 className="hotel-color">Special Requests</h5>
          <strong>Ghi chú: {booking.specialRequests}</strong>
        </div>

        {isDateValid() ? (
          <>
            <p>
              Total payment: <strong>${payment}</strong>
            </p>

            {isFormValid && !isProcessing ? (
              <Button variant="success" onClick={onConfirm}>
                {isProcessing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            ) : null}
          </>
        ) : (
          <p className="text-danger">
            Ngày check-out phải sau ngày check-in
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
