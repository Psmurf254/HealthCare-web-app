import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, CssBaseline, Avatar, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { apiProxy } from '../../utils/constants';

const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${apiProxy}/api/register/`, {
        username,
        password,
      });

      const { access } = response.data;
      onRegister(access);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'Registration failed');
      } else if (error.request) {
        setError('No response from the server. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{minHeight: '70vh'}}>
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '8vh',
          
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
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
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}
        <Typography component="p" variant="body2" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </div>
    </Container>
  );
};

export default RegisterForm;
