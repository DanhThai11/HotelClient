import React, { useState } from "react";
import { addRoom, api } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";

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
    if (name === "price") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const dotCount = (numericValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        return;
      }
      const parts = numericValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        return;
      }
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
        setErrorMessage("Kích thước ảnh không được vượt quá 5MB");
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
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !newRoom.price ||
      isNaN(parseFloat(newRoom.price)) ||
      parseFloat(newRoom.price) <= 0
    ) {
      setErrorMessage("Giá phòng không hợp lệ. Vui lòng nhập giá lớn hơn 0.");
      setIsLoading(false);
      return;
    }

    try {
      const formattedRoom = {
        ...newRoom,
        price: parseFloat(newRoom.price), // dùng parseFloat thay vì .toString()
        amenities: newRoom.amenities
          ? newRoom.amenities.split(",").map((item) => item.trim())
          : [],
      };

      const formData = new FormData();
      for (const key in formattedRoom) {
        if (key !== "photo") {
          formData.append(key, formattedRoom[key]);
        }
      }

      if (newRoom.photo) {
        formData.append("photo", newRoom.photo);
      }

      const response = await addRoom(formData);

      if (response.status === 201 && response.data.code === 0) {
        setSuccessMessage("Thêm phòng mới thành công!");
        setNewRoom({
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
      } else {
        setErrorMessage(response.data?.message || "Thêm phòng mới thất bại.");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      setErrorMessage(error.message || "Đã xảy ra lỗi khi thêm phòng.");
    } finally {
      setIsLoading(false);
    }
  };

  const roomTypes = ["SINGLE", "DOUBLE", "SUITE", "DELUXE"];
  const roomCapacities = [1, 2, 3, 4, 5, 6];
  const roomStatuses = ["AVAILABLE", "RESERVED", "OCCUPIED", "MAINTENANCE"];

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Thêm phòng mới
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên phòng"
              name="name"
              value={newRoom.name}
              onChange={handleRoomInputChange}
              margin="normal"
              required
            />
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số phòng"
                name="roomNumber"
                value={newRoom.roomNumber}
                onChange={handleRoomInputChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={newRoom.description}
                onChange={handleRoomInputChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiện nghi (Ngăn cách bằng dấu phẩy)"
                name="amenities"
                value={newRoom.amenities}
                onChange={handleRoomInputChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá phòng"
                name="price"
                value={newRoom.price}
                onChange={handleRoomInputChange}
                margin="normal"
                type="text"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Loại phòng"
                name="type"
                value={newRoom.type}
                onChange={handleRoomInputChange}
                margin="normal"
                required
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Sức chứa"
                name="capacity"
                value={newRoom.capacity}
                onChange={handleRoomInputChange}
                margin="normal"
                required
              >
                {roomCapacities.map((capacity) => (
                  <MenuItem key={capacity} value={capacity}>
                    {capacity}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                name="status"
                value={newRoom.status}
                onChange={handleRoomInputChange}
                margin="normal"
                required
              >
                {roomStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
              >
                Upload Room Photo
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  required
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Lưu phòng"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AddRoom;
