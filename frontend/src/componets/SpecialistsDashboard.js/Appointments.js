import React, { useState, useEffect } from "react";
import {
  Stack,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import { apiProxy } from "../../utils/constants";
import AppointmentCard from "./AppointmentCard";

const Appointments = ({ token, setAppointments, appointments }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [intervalId, setIntervalId] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${apiProxy}/api/appointments/specialist/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();

        const appointmentsWithDetails = await Promise.all(
          data.map(async (appointment) => {
            const patientResponse = await fetch(
              `${apiProxy}/api/appointment/patients/${appointment.patient}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const patientData = await patientResponse.json();

            const countdownTimer = calculateCountdownTimer(
              appointment.date_time
            );

            return {
              ...appointment,
              patientDetails: patientData,
              countdownTimer: countdownTimer,
            };
          })
        );

        setAppointments(appointmentsWithDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments. Please try again.");
        setLoading(false);
      }
    };

    fetchAppointments();

    return () => clearInterval(intervalId);
  }, [token, intervalId, setAppointments]);

  useEffect(() => {
    const id = setInterval(() => {
      setAppointments((prevAppointments) => {
        return prevAppointments.map((appointment) => {
          return {
            ...appointment,
            countdownTimer: calculateCountdownTimer(appointment.date_time),
          };
        });
      });
    }, 1000);

    setIntervalId(id);

    return () => clearInterval(id);
  }, [setAppointments]);

  const calculateCountdownTimer = (dateTime) => {
    const timeDiff = new Date(dateTime) - new Date();
    if (timeDiff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      statusFilter === "all" || appointment.status === statusFilter
  );

  const openPatientInfoModal = (patientDetails) => {
    setSelectedPatient(patientDetails);
  };

  const closePatientInfoModal = () => {
    setSelectedPatient(null);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Appointments</Typography>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        {loading && <CircularProgress />}
      </Stack>

      {error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Stack spacing={2}>
          <Stack direction="row" gap={5}>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="finished">Finished</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ color: "blue" }}>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date and Time</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Meeting</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <>
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      openPatientInfoModal={openPatientInfoModal}
                    />
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {/* Patient Information Modal */}
      <Dialog open={!!selectedPatient} onClose={closePatientInfoModal}>
        <DialogTitle>Patient Information</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Stack gap={3}>
              <Divider my={2} />
              <Typography variant="subtitle1">
                Full Name: {selectedPatient.full_name}
              </Typography>
              <Typography variant="subtitle1">
                Phone: {selectedPatient.contact_phone} |{" "}
                {selectedPatient.contact_email}
              </Typography>
              <Typography variant="subtitle1">
                ECName: {selectedPatient.emergency_contact_name}
              </Typography>
              <Typography variant="subtitle1">
                ECPhone: {selectedPatient.emergency_contact_phone}
              </Typography>
              <Typography variant="subtitle1">
                Languages: {selectedPatient.preferred_language}
              </Typography>
              <Typography variant="subtitle1">
                Blood Pressure: {selectedPatient.blood_pressure}
              </Typography>
              <Typography variant="subtitle1">
                Weight: {selectedPatient.weight}
              </Typography>
              <Typography variant="subtitle1">
                prescription_history: {selectedPatient.prescription_history}
              </Typography>
              <Typography variant="subtitle1">
                Current Medication: {selectedPatient.current_medications}
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePatientInfoModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Appointments;
