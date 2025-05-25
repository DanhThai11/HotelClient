import React, { useState } from "react";
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
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../utils/ApiFunctions";

const drawerWidth = 260;

const AdminLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConcept, setOpenConcept] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    { text: "Cài đặt", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

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
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 1,
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
        {/* Nội dung trang con */}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
