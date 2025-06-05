import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../components/utils/ApiFunctions";

const EditRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [room, setRoom] = useState({
    roomNumber: "",
    description: "",
    price: "",
    type: "",
    capacity: "",
    status: "",
  });
  const [originalRoom, setOriginalRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await getRoomById(roomId);
        if (response.code === 0 && response.result) {
          const roomData = response.result;
          const roomState = {
            roomNumber: roomData.roomNumber || "",
            description: roomData.description || "",
            price: roomData.price || "",
            type: roomData.type || "",
            capacity: roomData.capacity || "",
            status: roomData.status || "",
          };
          setRoom(roomState);
          setOriginalRoom(roomState);

          if (roomData.photo) {
            if (roomData.photo.startsWith("data:image")) {
              setImagePreview(roomData.photo);
            } else if (roomData.photo.startsWith("http")) {
              setImagePreview(roomData.photo);
            } else {
              setImagePreview(`data:image/png;base64,${roomData.photo}`);
            }
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "capacity") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setRoom({ ...room, [name]: numericValue });
    } else {
      setRoom({ ...room, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      if (selectedImage.size > 5000000) {
        setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      if (room.roomNumber !== originalRoom.roomNumber) {
        formData.append("roomNumber", room.roomNumber);
      } else {
        formData.append("roomNumber", originalRoom.roomNumber);
      }

      if (room.description !== originalRoom.description) {
        formData.append("description", room.description);
      } else {
        formData.append("description", originalRoom.description);
      }

      if (room.price !== originalRoom.price) {
        formData.append("price", room.price);
      } else {
        formData.append("price", originalRoom.price);
      }

      if (room.type !== originalRoom.type) {
        formData.append("type", room.type);
      } else {
        formData.append("type", originalRoom.type);
      }

      if (room.capacity !== originalRoom.capacity) {
        formData.append("capacity", room.capacity);
      } else {
        formData.append("capacity", originalRoom.capacity);
      }

      if (room.status !== originalRoom.status) {
        formData.append("status", room.status);
      } else {
        formData.append("status", originalRoom.status);
      }

      if (imagePreview) {
        if (imagePreview.startsWith("data:image")) {
          const imageBlob = await fetch(imagePreview).then((r) => r.blob());
          if (imageBlob.size > 5000000) {
            setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
            setLoading(false);
            return;
          }
          formData.append("photo", imageBlob, "room-image.jpg");
        } else if (imagePreview.startsWith("http")) {
          formData.append("photo", imagePreview);
        } else {
          formData.append("photo", imagePreview);
        }
      }

      const response = await updateRoom(roomId, formData);
      if (response.code === 0) {
        setSuccessMessage("Cập nhật phòng thành công!");
        setTimeout(() => {
          navigate("/admin/existing-rooms");
        }, 2000);
      } else {
        setErrorMessage(response.message || "Cập nhật phòng thất bại");
      }
    } catch (error) {
      setErrorMessage(error.message || "Có lỗi xảy ra khi cập nhật phòng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary fw-bold mb-4">Edit Room</h2>
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
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="text"
                name="roomNumber"
                placeholder="Nhập số phòng"
                value={room.roomNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Nhập mô tả phòng"
                value={room.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá phòng (mỗi đêm)</Form.Label>
              <Form.Control
                type="text"
                name="price"
                placeholder="Nhập giá phòng"
                value={room.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Control
                type="text"
                name="type"
                placeholder="Nhập loại phòng"
                value={room.type}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sức chứa</Form.Label>
              <Form.Control
                type="text"
                name="capacity"
                placeholder="Nhập sức chứa"
                value={room.capacity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={room.status}
                onChange={handleInputChange}
                required
              >
                <option value="AVAILABLE">Có sẵn</option>
                <option value="BOOKED">Đã đặt</option>
                <option value="MAINTENANCE">Bảo trì</option>
              </Form.Select>
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
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật phòng"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRoom;
