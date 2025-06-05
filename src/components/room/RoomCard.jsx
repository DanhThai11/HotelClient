import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  return (
    <Col key={room.id} className="mb-4" xs={12} md={6} lg={4}>
      <Card className="room-card shadow-sm border-0">
        <div className="room-img position-relative">
          <Link to={`/book-room/${room.id}`}>
            <Card.Img
              variant="top"
              src={`data:image/png;base64,${room.photo}`}
              alt="Room Photo"
              className="img-fluid rounded-top"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
          </Link>
          <div
            className="position-absolute top-0 start-0 bg-dark text-white px-3 py-1 rounded-end"
            style={{
              fontSize: "0.9rem",
              opacity: 0.8,
            }}
          >
            {room?.price
              ? `${room.price.toLocaleString("vi-VN")} VND / night`
              : "Price not available"}{" "}
          </div>
        </div>
        <Card.Body className="room-details p-4">
          <Card.Title className="room-type text-primary fw-bold">
            {room.type}
          </Card.Title>
          <Card.Text
            className="room-description text-muted"
            style={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
            }}
          >
            {room.description}
          </Card.Text>
          <Link
            to={`/book-room/${room.id}`}
            className="btn btn-primary btn-block mt-3"
            style={{
              backgroundColor: "#007bff",
              borderColor: "#007bff",
              fontWeight: "bold",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
            }}
          >
            Book Now
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RoomCard;
