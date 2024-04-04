import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import UpdateProfileForm from "./UpdateProfileForm";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiProxy } from "../../utils/constants";

const Profile = ({ patientData, setPatient, token, appointments }) => {
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    if (patientData.length > 0) {
      setLoading(false);
    }
  }, [patientData]);

  const handleUpdate = (updatedData) => {
    setPatient([updatedData]);
    setShowUpdateForm(false);
  };

  const handleShowUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const now = new Date();


  const upcoming_appointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return appointmentDate > now; 
    })
    .map((appointment) => ({
      id: appointment.specialist.id,
      name: appointment.specialistDetails.full_name,
      description: appointment.description,
      timestamp: new Date(appointment.date_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      profile_picture: appointment.specialistDetails.profile_picture,
      countdownTimer: appointment.countdownTimer,
      appointmentDate: new Date(appointment.date_time),
      status: appointment.status,
    }))
    .sort((a, b) => a.appointmentDate - b.appointmentDate);

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mt="1rem"
      >
        {loading && <CircularProgress />}
      </Stack>
      {!loading &&
        patientData.map((patient, index) => (
          <Box mt={4} key={index}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Avatar
                      alt="User Avatar"
                      src={patient.profile_picture}
                      sx={{ width: 150, height: 150 }}
                    />
                  </CardContent>
                </Card>
           

                <Box mt={5}>
                  {upcoming_appointments.length > 0 && (
                    <Typography
                      fontSize="12px"
                      lineHeight={1.5}
                      mb={2}
                      color="purple"
                      textTransform="uppercase"
                      fontWeight={600}
                    >
                      Upcoming appointments
                    </Typography>
                  )}
                  {upcoming_appointments.map(
                    (item, index) =>
                      item.status === "approved" && (
                        <Accordion defaultExpanded key={index}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                          >
                            <CardMedia sx={{ display: "inline-flex", gap: 1 }}>
                              <Avatar
                                alt="User Avatar"
                                src={`${apiProxy}{item.profile_picture}`}
                                sx={{ width: 35, height: 35 }}
                              />
                              <Typography
                                fontSize="12px"
                                color="gray"
                                opacity={0.8}
                              >
                                {item.appointmentDate.toLocaleString()}
                              </Typography>
                            </CardMedia>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Box width="100%">
                              <Typography
                                fontSize="12px"
                                color="text.secondary"
                                opacity={0.8}
                              >
                                {item.description}
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )
                  )}
                </Box>
              </Grid>

              {/* Patient Information */}
              <Grid item xs={12} md={9}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {patient.full_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                    >
                      {patient.contact_phone} | {patient.contact_email}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mt={2}
                      mb={4}
                    >
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleShowUpdateForm}
                      >
                        <Edit sx={{ mr: "7px" }} /> Update Profile
                      </Button>
                    </Stack>
                    <hr style={{ marginBottom: "14px" }} />

                  
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Gender
                        </Typography>
                        <Typography variant="body1">
                          {patient.gender}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Date of Birth
                        </Typography>
                        <Typography variant="body1">
                          {patient.date_of_birth}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          ECN
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergency_contact_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          ECNo.
                        </Typography>
                        <Typography variant="body1">
                          {patient.emergency_contact_phone}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Weight
                        </Typography>
                        <Typography variant="body1">
                          {patient.weight}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Blood Pressure
                        </Typography>
                        <Typography variant="body1">
                          {patient.blood_pressure}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Heart Rate
                        </Typography>
                        <Typography variant="body1">
                          {patient.heart_rate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={4}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          gutterBottom
                        >
                          Language
                        </Typography>
                        <Typography variant="body1">
                          {patient.preferred_language}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Modal for Update Profile Form */}
                    <Dialog
                      open={showUpdateForm}
                      onClose={handleShowUpdateForm}
                    >
                      <DialogTitle>Update Profile</DialogTitle>
                      <DialogContent>
                        <UpdateProfileForm
                          patient={patient}
                          token={token}
                          onUpdate={handleUpdate}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleShowUpdateForm}>Cancel</Button>
                      </DialogActions>
                    </Dialog>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ))}
    </Stack>
  );
};

export default Profile;
