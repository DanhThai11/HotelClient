import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, getAllBookings } from "../utils/ApiFunctions";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Button,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  BookOnline as BookOnlineIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  BarChart as BarChartIcon,
  MonetizationOn as MonetizationOnIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { FaUsers, FaHotel, FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

const drawerWidth = 260;

// Mock data cho doanh thu và top phòng nếu chưa có API
const mockRevenue = 82373.21;
const mockTopRooms = [
  { name: "Phòng VIP 1", booked: 124, percent: 15.2 },
  { name: "Phòng Đôi", booked: 115, percent: 13.9 },
  { name: "Phòng Đơn", booked: 107, percent: 9.5 },
  { name: "Phòng Gia đình", booked: 102, percent: 2.3 },
  { name: "Phòng Suite", booked: 99, percent: -0.7 },
];
const mockChart = [
  { date: "01 Jun", bookings: 20 },
  { date: "02 Jun", bookings: 35 },
  { date: "03 Jun", bookings: 30 },
  { date: "04 Jun", bookings: 40 },
  { date: "05 Jun", bookings: 32 },
  { date: "06 Jun", bookings: 45 },
  { date: "07 Jun", bookings: 60 },
  { date: "08 Jun", bookings: 55 },
  { date: "09 Jun", bookings: 50 },
  { date: "10 Jun", bookings: 65 },
  { date: "11 Jun", bookings: 70 },
  { date: "12 Jun", bookings: 80 },
];

const mockBookings = [
  { id: 1, roomId: 1, checkInDate: "2024-06-01" },
  { id: 2, roomId: 2, checkInDate: "2024-06-02" },
  { id: 3, roomId: 3, checkInDate: "2024-06-03" },
  { id: 4, roomId: 4, checkInDate: "2024-06-04" },
];

const Admin = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConcept, setOpenConcept] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsData = await getAllRooms();
        setRooms(roomsData);
        await fetchBookings();
      } catch (error) {
        setRooms([]);
        setBookings([]);
      }
    };
    fetchData();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      if (response.code === 0) {
        setBookings(response.result);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    const token = localStorage.getItem("token");
    await logoutUser(token);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    {
      text: "Quản lý phòng",
      icon: <HotelIcon />,
      path: "/admin/existing-rooms",
    },
    {
      text: "Quản lý đặt phòng",
      icon: <BookOnlineIcon />,
      path: "/admin/existing-bookings",
    },
    { text: "Quản lý người dùng", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Cài đặt", icon: <SettingsIcon />, path: "/settings" },
  ];

  // Sidebar nâng cao với nhóm menu (dropdown)
  const sidebar = (
    <Box
      sx={{
        height: "100%",
        background: "#fff",
        borderRight: "1px solid #eee",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          cursor: "pointer",
        }}
        onClick={() => navigate("/admin")}
      >
        <Avatar sx={{ bgcolor: "#1976d2", mr: 1 }}>R</Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#222" }}>
          Rex Hotel Admin
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              "&.Mui-selected, &:hover": {
                background: "#f5f7fa",
                color: "#1976d2",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => setOpenConcept(!openConcept)}
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
          {openConcept ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openConcept} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemIcon>
                <MonetizationOnIcon />
              </ListItemIcon>
              <ListItemText primary="Doanh thu" />
            </ListItem>
            <ListItem button sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Phòng nổi bật" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  // Tính toán các thống kê
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  return (
    <Box sx={{ display: "flex", background: "#f5f6fa", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#fff",
            borderRight: "1px solid #eee",
          },
        }}
        open
      >
        {sidebar}
      </Drawer>
      {/* Main content */}
      <Box sx={{ flexGrow: 1, p: 0 }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "#fff",
            color: "#222",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
            borderBottom: "1px solid #eee",
            px: 3,
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end", minHeight: 64 }}>
            <Tooltip title="Thông báo">
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Tài khoản">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 2 }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileClick}>Hồ sơ</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Cài đặt</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        {/* Dashboard content */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Card thống kê */}
            <Grid item xs={12} md={4} lg={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng số phòng
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {rooms.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng đặt phòng
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    {totalBookings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Phòng trống
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#ed6c02" }}
                  >
                    {rooms.filter((room) => room.status === "AVAILABLE").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Doanh thu (tháng)
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#0288d1" }}
                  >
                    ${mockRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Biểu đồ đặt phòng */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: 340 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Thống kê đặt phòng
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={mockChart}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ReTooltip />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#1976d2"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            {/* Top phòng nổi bật */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: 340 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    Phòng nổi bật
                  </Typography>
                  {mockTopRooms.map((room, idx) => (
                    <Box
                      key={room.name}
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: idx === 0 ? "#1976d2" : "#eee",
                          color: idx === 0 ? "#fff" : "#222",
                          mr: 2,
                        }}
                      >
                        <StarIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {room.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Đặt: {room.booked}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: room.percent > 0 ? "#2e7d32" : "#d32f2f",
                          fontWeight: 600,
                        }}
                      >
                        {room.percent > 0 ? "+" : ""}
                        {room.percent}%
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Admin;
