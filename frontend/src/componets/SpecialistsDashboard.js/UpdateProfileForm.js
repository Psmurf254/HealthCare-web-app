import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

const UpdateProfileForm = ({ specialist, onUpdate, token }) => {
  const [formData, setFormData] = useState({
    full_name: specialist.full_name,
    category: specialist.category,
    gender: specialist.gender,
    date_of_birth: specialist.date_of_birth,
    contact_phone: specialist.contact_phone,
    contact_email: specialist.contact_email,
    description: specialist.description,
    medical_license_number: specialist.medical_license_number,
    years_of_experience: specialist.years_of_experience,
    medical_certifications: specialist.medical_certifications,
    pricing: specialist.pricing,
    achievements: specialist.achievements,
    background: specialist.background,
    x: specialist.x,
    whatsApp: specialist.whatsApp,
    facebook: specialist.facebook,
    instagram: specialist.instagram,
    on_call_information: specialist.on_call_information,
    emergency_contact_details: specialist.emergency_contact_details,
    languages_spoken: specialist.languages_spoken,
    feedback_history: specialist.feedback_history,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    fetch(`http://localhost:8000/api/specialist/update/${specialist.id}/`, {
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
    <Stack spacing={2} width="100%">
      <TextField
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
      />

      <TextField
        label="Category"
        name="category"
        value={formData.category}
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
        value={formData.date_of_birth}
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
        label="Description"
        name="description"
        value={formData.description}
        multiline
        rows={4}
        fullWidth
        onChange={handleChange}
      />

      <TextField
        label="Background"
        name="background"
        value={formData.background}
        multiline
        rows={4}
        fullWidth
        onChange={handleChange}
      />

      <TextField
        label="Medical License Number"
        name="medical_license_number"
        value={formData.medical_license_number}
        onChange={handleChange}
      />

      <TextField
        label="Years of Experience"
        name="years_of_experience"
        value={formData.years_of_experience}
        onChange={handleChange}
      />

      <TextField
        label="Medical Certifications"
        name="medical_certifications"
        value={formData.medical_certifications}
        onChange={handleChange}
      />

      <TextField
        label="Pricing"
        name="pricing"
        value={formData.pricing}
        onChange={handleChange}
      />

      <TextField
        label="Achievements"
        name="achievements"
        value={formData.achievements}
        onChange={handleChange}
      />

      <TextField
        label="X"
        name="x"
        value={formData.x}
        onChange={handleChange}
      />

      <TextField
        label="WhatsApp"
        name="whatsApp"
        value={formData.whatsApp}
        onChange={handleChange}
      />

      <TextField
        label="Facebook"
        name="facebook"
        value={formData.facebook}
        onChange={handleChange}
      />

      <TextField
        label="Instagram"
        name="instagram"
        value={formData.instagram}
        onChange={handleChange}
      />

      <TextField
        label="On Call Information"
        name="on_call_information"
        value={formData.on_call_information}
        onChange={handleChange}
      />

      <TextField
        label="Emergency Contact Details"
        name="emergency_contact_details"
        value={formData.emergency_contact_details}
        onChange={handleChange}
      />

      <TextField
        label="Languages Spoken"
        name="languages_spoken"
        value={formData.languages_spoken}
        onChange={handleChange}
      />

      <TextField
        label="Feedback History"
        name="feedback_history"
        value={formData.feedback_history}
        onChange={handleChange}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Update Profile
      </Button>
    </Stack>
  );
};

export default UpdateProfileForm;
