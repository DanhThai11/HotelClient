import React, { useEffect, useState } from "react";
import { getAllRooms } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const RoomCarousel = () => {
  const [rooms, setRooms] = useState([
    { id: "", type: "", price: "", photo: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllRooms()
      .then((data) => {
        setRooms(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="mt-5">Loading rooms....</div>;
  }
  if (errorMessage) {
    return <div className="text-danger mb-5 mt-5">Error : {errorMessage}</div>;
  }

  return (
    <section className="bg-light mb-5 mt-5 shadow">
      <Container className="d-flex justify-content-start mt-3 mb-4">
        <Button
          variant="contained"
          component={Link}
          to="/browse-all-rooms"
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Browse All Rooms
        </Button>
      </Container>

      <Container>
        <Carousel indicators={false} interval={3000}>
          {[...Array(Math.ceil(rooms.length / 4))].map((_, index) => (
            <Carousel.Item key={index}>
              <Row>
                {rooms.slice(index * 4, index * 4 + 4).map((room) => (
                  <Col key={room.id} className="mb-4" xs={12} md={6} lg={3}>
                    <Card className="shadow-sm border-0">
                      <Link
                        to={`/book-room/${room.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Card.Img
                          variant="top"
                          src={`data:image/png;base64, ${room.photo}`}
                          alt="Room Photo"
                          className="w-100"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Link>
                      <Card.Body>
                        <Card.Title
                          className="hotel-color"
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {room.roomNumber}
                        </Card.Title>
                        <Card.Title
                          className="hotel-color"
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {room.type}
                        </Card.Title>
                        <Card.Title
                          className="room-price"
                          style={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#1976d2",
                          }}
                        >
                          {room.price.toLocaleString("vi-VN")} VND/night
                        </Card.Title>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/book-room/${room.id}`}
                            className="btn btn-hotel btn-sm"
                          >
                            Book Now
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default RoomCarousel;
