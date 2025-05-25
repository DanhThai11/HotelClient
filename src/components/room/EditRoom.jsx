import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
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

          // Xử lý hiển thị ảnh
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
    if (name === "price") {
      // Chỉ cho phép nhập số và dấu chấm
      const numericValue = value.replace(/[^0-9.]/g, "");
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

      // So sánh với dữ liệu gốc và chỉ gửi những trường có thay đổi
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

      // Xử lý ảnh
      if (imagePreview) {
        // Nếu ảnh là base64 hoặc data URL (ảnh mới được chọn)
        if (imagePreview.startsWith("data:image")) {
          const imageBlob = await fetch(imagePreview).then((r) => r.blob());
          // Kiểm tra kích thước ảnh
          if (imageBlob.size > 5000000) {
            // 5MB
            setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
            setLoading(false);
            return;
          }
          formData.append("photo", imageBlob, "room-image.jpg");
        }
        // Nếu ảnh là URL (ảnh cũ)
        else if (imagePreview.startsWith("http")) {
          formData.append("photo", imagePreview);
        }
        // Nếu ảnh là base64 string (ảnh cũ)
        else {
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
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Chỉnh sửa thông tin phòng
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số phòng"
                name="roomNumber"
                value={room.roomNumber}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={room.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá phòng"
                name="price"
                value={room.price}
                onChange={handleInputChange}
                margin="normal"
                type="text"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Loại phòng"
                name="type"
                value={room.type}
                onChange={handleInputChange}
                margin="normal"
              >
                <MenuItem value="SINGLE">Phòng đơn</MenuItem>
                <MenuItem value="DOUBLE">Phòng đôi</MenuItem>
                <MenuItem value="SUITE">Phòng suite</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sức chứa"
                name="capacity"
                value={room.capacity}
                onChange={handleInputChange}
                margin="normal"
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                name="status"
                value={room.status}
                onChange={handleInputChange}
                margin="normal"
              >
                <MenuItem value="AVAILABLE">Có sẵn</MenuItem>
                <MenuItem value="BOOKED">Đã đặt</MenuItem>
                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  Chọn ảnh phòng
                </Button>
              </label>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Room preview"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    mt: 2,
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Cập nhật phòng"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EditRoom;
