import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Card,
  InputAdornment,
  Grid,
  Divider,
} from "@mui/material";
import { DateRange } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { apiProxy } from "../utils/constants";

const CreatePatientAccount = ({ token }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    contact_phone: "",
    contact_email: "",
    medical_history: "null",
    allergies: "",
    medications: "null",
    immunization_records: "null",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    telemedicine_consultations_allowed: true,
    secure_messaging_enabled: true,
    blood_pressure: "",
    heart_rate: "",
    weight: "",
    current_medications: "null",
    prescription_history: "null",
    preferred_language: "",
    access_to_education_materials: true,
    appointment_reminders_enabled: true,
    communication_alerts_enabled: true,
    profile_picture: null,
    accessibility_tools_enabled: true,
    notification_preferences: true,
    account_security_settings: true,
    doctor_feedback_history: "null",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const val = type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch(`${apiProxy}/api/patients/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        navigate("/patient_dashboard/");
        console.log("Account created successfully!");
      } else {
        // Handle error, e.g., display an error message to the user
        const errorMessage = await response.text();
        setError("Something went wrong! Try again later");
        console.error("Failed to create account:", errorMessage);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginTop: "-3px" }}>
      <Stack alignItems="center" alignContent="center">
        <Card sx={{ padding: "20px" }}>
          <Typography variant="h6" color="text.secondary">
            Create Patient Account
          </Typography>
          <Divider sx={{ my: 2 }} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Full Name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Gender"
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Repeat similar grid items for other fields */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Contact Phone"
                  type="text"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Contact Email"
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Emergency Contact Name"
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Emergency Contact Phone"
                  type="text"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Profile Picture"
                  type="file"
                  name="profile_picture"
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Language"
                  type="text"
                  multiline
                  rows={4}
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              {/* Health Information */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Blood Pressure"
                  type="text"
                  multiline
                  rows={4}
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Heart Rate"
                  type="text"
                  multiline
                  rows={4}
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Weight"
                  type="text"
                  multiline
                  rows={4}
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Allergies"
                  multiline
                  rows={4}
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Divider sx={{ my: 2 }} />
              {error && (
                <Grid item xs={12}>
                  <Typography
                    color="error"
                    variant="body2"
                    textAlign="center"
                    paragraph
                  >
                    {error}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Divider sx={{ my: 2 }} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Divider sx={{ my: 2 }} />
                <Typography
                  component="p"
                  variant="body2"
                  style={{ marginTop: "1rem" }}
                >
                  You are a Specialist{" "}
                  <Link to="/specialist/account/create"> Create Account</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Stack>
    </section>
  );
};

export default CreatePatientAccount;
