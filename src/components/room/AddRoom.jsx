import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { addRoom } from "../../components/utils/ApiFunctions";

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({
    name: "",
    roomNumber: "",
    description: "",
    price: "",
    type: "",
    capacity: "",
    status: "AVAILABLE",
    photo: null,
    amenities: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoomInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "price" || name === "capacity") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setNewRoom({ ...newRoom, [name]: numericValue });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (selectedImage.size > 5000000) {
        setErrorMessage("Image size must not exceed 5MB");
        return;
      }
      setNewRoom({ ...newRoom, photo: selectedImage });
      setImagePreview(URL.createObjectURL(selectedImage));
      setSuccessMessage("");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await addRoom(newRoom);
      if (response) {
        setSuccessMessage("Room added successfully!");
        setErrorMessage("");
        setNewRoom({
          name: "",
          roomNumber: "",
          description: "",
          price: "",
          type: "",
          capacity: "",
          status: "AVAILABLE",
          photo: null,
          amenities: "",
        });
        setImagePreview("");
      }
    } catch (error) {
      setErrorMessage(error.response.dmessage || "Failed to add room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary fw-bold mb-4">Add a New Room</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          {successMessage && (
            <Alert variant="success" className="text-center">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter room name"
                value={newRoom.name}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                placeholder="Enter room number"
                value={newRoom.roomNumber}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter room description"
                value={newRoom.description}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá (mỗi đêm)</Form.Label>
              <Form.Control
                type="text"
                name="price"
                placeholder="Enter price"
                value={newRoom.price}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Control
                type="text"
                name="type"
                placeholder="Enter room type"
                value={newRoom.type}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sức chứa</Form.Label>
              <Form.Control
                type="text"
                name="capacity"
                placeholder="Enter room capacity"
                value={newRoom.capacity}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={newRoom.status}
                onChange={handleRoomInputChange}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tiện ích</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                placeholder="Enter amenities (comma-separated)"
                value={newRoom.amenities}
                onChange={handleRoomInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh phòng</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              )}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? "Adding Room..." : "Add Room"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRoom;
