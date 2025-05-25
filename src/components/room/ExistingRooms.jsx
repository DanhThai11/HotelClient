import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRooms, deleteRoom } from "../utils/ApiFunctions";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllRooms();
      if (response.code === 0) {
        setRooms(response.result);
      } else {
        throw new Error(response.message || "Không thể tải danh sách phòng");
      }
    } catch (error) {
      setError(error.message || "Không thể tải danh sách phòng");
      setRooms([]);
      toast.error(error.message || "Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await deleteRoom(selectedRoom.id);
      if (response.code === 0) {
        toast.success("Xóa phòng thành công");
        fetchRooms(); // Refresh danh sách
      } else {
        throw new Error(response.message || "Không thể xóa phòng");
      }
    } catch (error) {
      toast.error(error.message || "Không thể xóa phòng");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" component="h2">
              Quản lý phòng
            </Typography>
            <Link to="/add-room" className="btn btn-hotel">
              Thêm phòng mới
            </Link>
          </Box>

          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Loại phòng</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Sức chứa</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.id}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{room.description}</TableCell>
                      <TableCell>
                        {room.price.toLocaleString("vi-VN")} VNĐ
                      </TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        <Chip
                          label={room.status}
                          color={
                            room.status === "AVAILABLE" ? "success" : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/edit-room/${room.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(room)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa phòng {selectedRoom?.id} - {selectedRoom?.type}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExistingRooms;
