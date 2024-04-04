import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiProxy } from "../../utils/constants";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      onLogin(accessToken);
    }
  }, [onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }

      setLoading(true);

      const response = await axios.post(`${apiProxy}/api/token/`, {
        username,
        password,
      });

      const { access } = response.data;

      localStorage.setItem("accessToken", access);

      onLogin(access);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </form>
        {loading && <CircularProgress style={{ marginTop: "1rem" }} />}
        {error && <Typography color="error">{error}</Typography>}
        <Typography
          component="p"
          variant="body2"
          style={{ marginTop: "1rem" }}
        >
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </div>
    </Container>
  );
};

export default LoginForm;
