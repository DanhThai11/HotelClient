import React, { useEffect, useState } from "react";
import { getAllRooms, deleteRoom } from "../../services/RoomService";
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaEdit, FaEye, FaPlus, FaTrashAlt, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setFilteredRooms(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(
        rooms.filter(
          (room) =>
            room.type?.toLowerCase().includes(search.toLowerCase()) ||
            String(room.id).includes(search) ||
            String(room.price).includes(search)
        )
      );
    }
    setCurrentPage(1);
  }, [rooms, search]);

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId);
      setSuccessMessage(`Đã xóa phòng số ${roomId}`);
      fetchRooms();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Danh sách phòng
        </Typography>
        <Button
          component={Link}
          to="/admin/add-room"
          variant="contained"
          startIcon={<FaPlus />}
          sx={{ borderRadius: 2 }}
        >
          Thêm phòng
        </Button>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm theo loại phòng, ID, giá..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
      </Stack>
      {successMessage && (
        <Snackbar open autoHideDuration={3000} onClose={() => setSuccessMessage("")}> 
          <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
        </Snackbar>
      )}
      {errorMessage && (
        <Snackbar open autoHideDuration={3000} onClose={() => setErrorMessage("")}> 
          <Alert severity="error" sx={{ width: '100%' }}>{errorMessage}</Alert>
        </Snackbar>
      )}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Loại phòng</TableCell>
                <TableCell align="center">Giá phòng</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : currentRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Không có phòng nào</TableCell>
                </TableRow>
              ) : (
                currentRooms.map((room) => (
                  <TableRow key={room.id} hover>
                    <TableCell align="center">{room.id}</TableCell>
                    <TableCell align="center">{room.type}</TableCell>
                    <TableCell align="center">${room.price}</TableCell>
                    <TableCell align="center">{room.status}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          component={Link}
                          to={`/admin/edit-room/${room.id}`}
                          color="info"
                          size="small"
                        >
                          <FaEye />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/admin/edit-room/${room.id}`}
                          color="warning"
                          size="small"
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(room.id)}
                        >
                          <FaTrashAlt />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack alignItems="center" my={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default ExistingRooms;
