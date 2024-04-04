import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import { DateRange } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { apiProxy } from "../utils/constants";

const CreateSpecialistAccount = ({ token }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    category: "",
    gender: "",
    date_of_birth: "",
    contact_phone: "",
    contact_email: "",
    description: "",
    medical_license_number: "",
    years_of_experience: "",
    medical_certifications: "",
    pricing: "",

    achievements: "",
    background: "",
    x: "",
    whatsApp: "",
    facebook: "",
    instagram: "",

    on_call_information: "",
    emergency_contact_details: "",
    languages_spoken: "",
    feedback_history: "null",
    profile_picture: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const responseCategories = await fetch(`${apiProxy}/api/categories/`);
      const dataCategories = await responseCategories.json();
      setCategories(dataCategories);
    };

    fetchCategories();
  }, []);

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

      const response = await fetch(`${apiProxy}/api/specialists/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Account created successfully!");
        navigate("specialist_dashboard");
      } else {
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
            Create Specialist Account
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
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
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
                  label="Years of Experience"
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Medical License Number"
                  type="text"
                  name="medical_license_number"
                  value={formData.medical_license_number}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Languages Spoken"
                  type="text"
                  multiline
                  rows={4}
                  name="languages_spoken"
                  value={formData.languages_spoken}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Description"
                  type="text"
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Medical Certifications"
                  type="text"
                  multiline
                  rows={4}
                  name="medical_certifications"
                  value={formData.medical_certifications}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="On Call Information"
                  type="text"
                  multiline
                  rows={4}
                  name="on_call_information"
                  value={formData.on_call_information}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Emergency Contact Details"
                  multiline
                  rows={4}
                  name="emergency_contact_details"
                  value={formData.emergency_contact_details}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Background"
                  type="text"
                  multiline
                  rows={4}
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Enter Achivements separated by comma (,)"
                  type="text"
                  multiline
                  rows={4}
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="X"
                  type="text"
                  multiline
                  rows={4}
                  name="x"
                  value={formData.x}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="whatsApp"
                  type="text"
                  multiline
                  rows={4}
                  name="whatsApp"
                  value={formData.whatsApp}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="facebook"
                  type="text"
                  multiline
                  rows={4}
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="instagram"
                  type="text"
                  multiline
                  rows={4}
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  margin="normal"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Pricing [ksh]"
                  type="number"
                  multiline
                  rows={4}
                  name="pricing"
                  value={formData.pricing}
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
                  You are a Patient{" "}
                  <Link to="/patient/account/create"> Create Account</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Stack>
    </section>
  );
};

export default CreateSpecialistAccount;
