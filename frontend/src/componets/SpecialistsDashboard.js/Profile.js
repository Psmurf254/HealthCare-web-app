import React, { useState, useEffect } from "react";
import {
  Grid,
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
  Divider,
  Card,
  CardMedia,
  LinearProgress,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import UpdateProfileForm from "./UpdateProfileForm";
import { HeaderImage3 } from "../../utils/constants";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Profile = ({ specialistData, setSpecialist, token, appointments }) => {
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    if (specialistData.length > 0) {
      setLoading(false);
    }
  }, [specialistData]);

  const handleUpdate = (updatedData) => {
    setSpecialist([updatedData]);
    setShowUpdateForm(false);
  };

  const handleShowUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  // Upcoming Appointments
  const now = new Date();

  const upcoming_appointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return appointmentDate > now; // Filter appointments in the future
    })
    .map((appointment) => ({
      id: appointment.patientDetails.id,
      name: appointment.patientDetails.full_name,
      description: appointment.description,
      timestamp: new Date(appointment.date_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      profile_picture: appointment.patientDetails.profile_picture,
      countdownTimer: appointment.countdownTimer,
      appointmentDate: new Date(appointment.date_time),
      status: appointment.status,
    }))
    .sort((a, b) => a.appointmentDate - b.appointmentDate);

  const stackStyle = {
    backgroundImage: `linear-gradient(rgba(4,9,30,0.2), rgba(4,9,30,0.2)), url(${HeaderImage3})`,
  };

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="start"
        alignItems="center"
        width="100%"
        mt="1rem"
      >
        {loading && <CircularProgress />}
      </Stack>
      {!loading &&
        specialistData.map((specialist, index) => (
          <Box>
            {/* Modal for Update Profile Form */}
            <Dialog open={showUpdateForm} onClose={handleShowUpdateForm}>
              <DialogTitle>Update Profile</DialogTitle>
              <DialogContent>
                <UpdateProfileForm
                  specialist={specialist}
                  token={token}
                  onUpdate={handleUpdate}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleShowUpdateForm}>Cancel</Button>
              </DialogActions>
            </Dialog>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8} sx={{ position: "relative" }}>
                <Box
                  sx={{ zIndex: 99 }}
                  className="profilebg"
                  style={stackStyle}
                >
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleShowUpdateForm}
                    sx={{ position: "absolute", bottom: 0, right: 0 }}
                  >
                    <Edit sx={{ mr: "7px" }} /> Update Profile
                  </Button>
                </Box>

                <Box display="flex" gap={2} ml={-2}>
                  <CardContent sx={{ zIndex: 99, maxWidth: 200, mt: -5 }}>
                    <Avatar
                      alt="User Avatar"
                      src={specialist.profile_picture}
                      sx={{
                        width: 150,
                        height: 150,
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                        borderRadius: "5px",
                      }}
                    />
                  </CardContent>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {specialist.full_name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="gray"
                      gutterBottom
                      mb={2}
                    >
                      {specialist.contact_phone} | {specialist.contact_email}
                    </Typography>

                    <Typography
                      color="#000"
                      variant="h6"
                      className="pricing"
                      style={{
                        textAlign: "left",
                        width: { lg: "50%", sm: "100%", xm: "100%" },
                      }}
                    >
                      Ksh {specialist.pricing}
                    </Typography>
                  </Box>
                </Box>

                <Divider mt={2} />
                <Typography component="div" variant="h6" mt={2}>
                  Background
                </Typography>

                <Typography
                  mt={1}
                  lineHeight={1.5}
                  color="text.secondary"
                  fontSize="15px"
                  component="div"
                  sx={{}}
                >
                  {specialist.description
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                {/* Section 1 */}

                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Your information
                </Typography>
                <Card sx={{ p: 2 }}>
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
                        {specialist.gender}
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
                        {specialist.date_of_birth}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {specialist.category}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Medical Licence
                      </Typography>
                      <Typography variant="body1">
                        {specialist.medical_license_number}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Years of experience
                      </Typography>
                      <Typography variant="body1">
                        {specialist.years_of_experience}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        gutterBottom
                      >
                        Languages
                      </Typography>
                      <Typography variant="body1">
                        {specialist.languages_spoken}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
                {/* Upcoming appointments */}
                <Box mt={4}>
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
                                src={item.profile_picture}
                                sx={{ width: 35, height: 35 }}
                              />
                              <Typography
                                fontSize="12px"
                                color="gray"
                                opacity={0.8}
                              >
                                {item.countdownTimer.days > 0 &&
                                  `${item.countdownTimer.days}d `}
                                {item.countdownTimer.hours > 0 &&
                                  `${item.countdownTimer.hours}h `}
                                {item.countdownTimer.minutes > 0 &&
                                  `${item.countdownTimer.minutes}m `}
                                {item.countdownTimer.seconds}s
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateProgress(item.countdownTimer)}
                                />
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
            </Grid>
          </Box>
        ))}
    </Stack>
  );
};

const calculateProgress = (countdownTimer) => {
  const totalSeconds =
    countdownTimer.days * 24 * 60 * 60 +
    countdownTimer.hours * 60 * 60 +
    countdownTimer.minutes * 60 +
    countdownTimer.seconds;
  const totalTime = 24 * 60 * 60;
  return ((totalTime - totalSeconds) / totalTime) * 100;
};

export default Profile;
