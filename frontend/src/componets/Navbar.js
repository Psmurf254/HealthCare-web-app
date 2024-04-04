import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Paper,
  CardMedia,
  IconButton,
  Badge,
  Avatar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { logo } from "../utils/constants";
import { Link } from "react-router-dom";
import Notification from "./Notification";
import { apiProxy } from "../utils/constants";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ token, onLogout, isSpecialist, isPatient, patientData }) => {
  const isLoggedIn = !!token;

  const handleLogout = () => {
    onLogout();
  };

  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  const handleRightMenuToggle = () => {
    setIsRightMenuOpen(!isRightMenuOpen);
  };

  const handleLeftMenuToggle = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);

    setNotificationData((prevData) =>
      prevData.map((notification) => ({ ...notification, read: true }))
    );
  };

  const rightMenuStyles = isRightMenuOpen
    ? { mt: "0" }
    : { mt: { xs: "-100%", sm: "0", md: "0", lg: "0" } };

  const leftMenuStyles = isLeftMenuOpen
    ? { mt: "0" }
    : { mt: { xs: "-100%", sm: "0", md: "0", lg: "0" } };

  useEffect(() => {
    const fetchNotificatioData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/notifications/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setNotificationData(data);
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    if (token) {
      fetchNotificatioData();
    }
  }, [token]);

  return (
    <Stack sx={{ backgroundColor: "#fff" }}>
      <Box
        sx={{
          backgroundColor: "#272727",
          padding: "12px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px",
          }}
        >
          {Array.isArray(patientData) &&
            patientData.map((patient, index) => (
              <Typography
                fontSize="17px"
                component="h2"
                sx={{ fontFamily: "Arial", color: "#4CAF50" }}
              >
                Welcome back, <br />
                {patient.full_name}!
              </Typography>
            ))}
        </Box>

        <Box display="inline-flex" gap={4}>
          {isLoggedIn && (
            <Box>
              <IconButton color="primary" onClick={handleNotificationToggle}>
                <Badge
                  badgeContent={
                    Array.isArray(notificationData)
                      ? notificationData.filter(
                          (notification) => !notification.read
                        ).length
                      : 0
                  }
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Notification
                isOpen={isNotificationOpen}
                onClose={handleNotificationToggle}
                notificationData={notificationData}
                token={token}
              />
            </Box>
          )}

          {Array.isArray(patientData) &&
            patientData.map((patient, index) => (
              <CardMedia key={index}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    alt="User Avatar"
                    src={patient.profile_picture}
                    sx={{ width: 35, height: 35 }}
                  />
                  {patient.profile_picture && (
                    <div
                      style={{
                        position: "absolute",
                        backgroundColor: "green",
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        bottom: 0,
                        right: 0,
                        border: "2px solid white",
                      }}
                    />
                  )}
                </div>
              </CardMedia>
            ))}
        </Box>
      </Box>

      <Paper sx={{}}>
        <Box
          sx={{
            padding: "12px",
            px: 0,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: { lg: "none", md: "none", sm: "block", xm: "block" },
            }}
            onClick={handleLeftMenuToggle}
          >
            {!isLeftMenuOpen ? (
              <IconButton>
                {" "}
                <MenuIcon sx={{ fontSize: 25 }} />{" "}
              </IconButton>
            ) : (
              <IconButton>
                <CloseIcon sx={{ fontSize: 25 }} />{" "}
              </IconButton>
            )}
          </Box>
          <Box id="Menu" className="leftMenu" sx={{ ...leftMenuStyles }}>
            <ul>
              <li onClick={handleLeftMenuToggle}>
                <Link to="/">Home </Link>{" "}
              </li>

              {isLoggedIn ? (
                <>
                  {isSpecialist && (
                    <li onClick={handleLeftMenuToggle}>
                      <Link to="/specialist_dashboard/">Doc_Dashboard </Link>
                    </li>
                  )}

                  {!isSpecialist && (
                    <li onClick={handleLeftMenuToggle}>
                      {" "}
                      <Link to="/specialist/account/create">
                        Create Doc account
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <></>
              )}

              <li onClick={handleLeftMenuToggle}>
                <a href="/#About"> About </a>
              </li>

              <li onClick={handleLeftMenuToggle}>
                <a href="/#services"> Services </a>
              </li>
            </ul>
          </Box>

          <Box>
            <Link to="/">
              <CardMedia className="logo">
                <img src={logo} alt="logo" width="100px" height="auto" />
              </CardMedia>
            </Link>
          </Box>

          <Box id="Menu" className="RightMenu" sx={{ ...rightMenuStyles }}>
            <ul>
              {isLoggedIn ? (
                <>
                  <li onClick={handleLogout}>Logout</li>

                  {isPatient && (
                    <li onClick={handleRightMenuToggle}>
                      <Link to="/patient_dashboard/">Patient_Dash </Link>
                    </li>
                  )}

                  {!isPatient && (
                    <li onClick={handleRightMenuToggle}>
                      {" "}
                      <Link to="/patient/account/create">
                        Create Patient account
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <Link to="/register">
                    <li onClick={handleRightMenuToggle}>Register</li>
                  </Link>
                  <Link to="/login">
                    <li onClick={handleRightMenuToggle}>Login</li>
                  </Link>
                </>
              )}
              <>
                <li onClick={handleRightMenuToggle}>
                  <a href="/#blogs"> Blogs </a>
                </li>

                <li onClick={handleRightMenuToggle}>
                  <a href="/#reviews"> Testimonials </a>
                </li>
              </>
            </ul>
          </Box>

          <Box
            sx={{
              display: { lg: "none", md: "none", sm: "block", xm: "block" },
            }}
            onClick={handleRightMenuToggle}
          >
            {!isRightMenuOpen ? (
              <IconButton>
                {" "}
                <MenuIcon sx={{ fontSize: 25 }} />{" "}
              </IconButton>
            ) : (
              <IconButton>
                <CloseIcon sx={{ fontSize: 25 }} />{" "}
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Navbar;
