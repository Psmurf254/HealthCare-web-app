import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { apiProxy } from "../../utils/constants";

const UpdateProfileForm = ({ patient, onUpdate, token }) => {
  const [formData, setFormData] = useState({
    full_name: patient.full_name,
    contact_phone: patient.contact_phone,
    contact_email: patient.contact_email,
    gender: patient.gender,
    date_of_birth: patient.date_of_birth,
    emergency_contact_name: patient.emergency_contact_name,
    emergency_contact_phone: patient.emergency_contact_phone,
    weight: patient.weight,
    blood_pressure: patient.blood_pressure,
    heart_rate: patient.heart_rate,
    preferred_language: patient.preferred_language,
    allergies: patient.allergies,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    fetch(`${apiProxy}/api/patients/${patient.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        onUpdate(data);
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
      />
      <TextField
        label="Contact Phone"
        name="contact_phone"
        value={formData.contact_phone}
        onChange={handleChange}
      />
      <TextField
        label="Contact Email"
        name="contact_email"
        value={formData.contact_email}
        onChange={handleChange}
      />
      <TextField
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      />
      <TextField
        label="Date of Birth"
        name="date_of_birth"
        type="date"
        value={formData.date_of_birth}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Emergency Contact Name"
        name="emergency_contact_name"
        value={formData.emergency_contact_name}
        onChange={handleChange}
      />
      <TextField
        label="Emergency Contact Phone"
        name="emergency_contact_phone"
        value={formData.emergency_contact_phone}
        onChange={handleChange}
      />
      <TextField
        label="Weight"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
      />
      <TextField
        label="Blood Pressure"
        name="blood_pressure"
        value={formData.blood_pressure}
        onChange={handleChange}
      />
      <TextField
        label="Heart Rate"
        name="heart_rate"
        value={formData.heart_rate}
        onChange={handleChange}
      />
      <TextField
        label="Preferred Language"
        name="preferred_language"
        value={formData.preferred_language}
        onChange={handleChange}
      />
      <TextField
        label="Allergies"
        name="allergies"
        value={formData.allergies}
        onChange={handleChange}
        multiline
        rows={4}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Update Profile
      </Button>
    </Stack>
  );
};

export default UpdateProfileForm;
