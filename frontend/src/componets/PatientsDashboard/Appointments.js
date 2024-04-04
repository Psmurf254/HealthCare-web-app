import React, { useState, useEffect } from "react";
import {
  Stack,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { apiProxy } from "../../utils/constants";

const Appointments = ({ token, appointments, setAppointments }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmissionError, setFeedbackSubmissionError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/appointments/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();

        const appointmentsWithDetails = await Promise.all(
          data.map(async (appointment) => {
            const patientResponse = await fetch(
              `${apiProxy}/api/patients/${appointment.patient}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const specialistResponse = await fetch(
              `${apiProxy}/api/specialists/${appointment.specialist}/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!patientResponse.ok || !specialistResponse.ok) {
              throw new Error("Failed to fetch patient or specialist details");
            }

            const patientData = await patientResponse.json();
            const specialistData = await specialistResponse.json();

            return {
              ...appointment,
              patientDetails: patientData,
              specialistDetails: specialistData,
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
  }, [token, setAppointments]);

  const openFeedbackDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setFeedbackDialogOpen(true);
  };

  const closeFeedbackDialog = () => {
    setSelectedAppointment(null);
    setFeedbackDialogOpen(false);
    setRating(0);
    setFeedbackText("");
    setSubmittingFeedback(false);
    setFeedbackSubmissionError(null);
  };

  const handleFeedbackSubmit = async () => {
    try {
      setSubmittingFeedback(true);

      const response = await fetch(
        `${apiProxy}/api/appointments/${selectedAppointment.specialistDetails.id}/feedback/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, feedback_text: feedbackText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      closeFeedbackDialog();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackSubmissionError(
        "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `${apiProxy}/api/appointments/${appointmentId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError("Failed to delete appointment. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      (statusFilter === "all" || appointment.status === statusFilter) &&
      (paymentFilter === "all" || appointment.payment_status === paymentFilter)
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My appointments</Typography>

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

            <FormControl>
              <InputLabel>Payment</InputLabel>
              <Select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                label="Payment"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ color: "blue" }}>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date and Time</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Typography fontSize="small" />{" "}
                      <Link
                        to={`/specialist/${appointment.specialistDetails.id}`}
                      >
                        {" "}
                        {appointment.specialistDetails.full_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="small" />{" "}
                      {new Date(appointment.date_time).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                      })}
                    </TableCell>
                    <TableCell>{appointment.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.payment_status}
                        color={getPaymentColor(appointment.payment_status)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {appointment.status === "finished" && (
                        <IconButton
                          onClick={() => openFeedbackDialog(appointment)}
                          disabled={submittingFeedback}
                        >
                          <FeedbackIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      <Dialog open={feedbackDialogOpen} onClose={closeFeedbackDialog}>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Divider sx={{ my: 2 }} />
          <Typography gutterBottom>Rate your experience:</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <Divider sx={{ my: 2 }} />

          <TextField
            label="Your Feedback"
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            multiline
            rows={4}
            sx={{ marginBottom: 2, width: "100%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <Divider sx={{ my: 2 }} />
        <DialogActions>
          <Button onClick={closeFeedbackDialog} disabled={submittingFeedback}>
            Cancel
          </Button>
          <Button
            onClick={handleFeedbackSubmit}
            color="primary"
            variant="contained"
            disabled={submittingFeedback}
          >
            {submittingFeedback ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogActions>
        {feedbackSubmissionError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {feedbackSubmissionError}
          </Alert>
        )}
      </Dialog>
    </Stack>
  );
};

export default Appointments;

const getStatusColor = (status) => {
  switch (status) {
    case "processing":
      return "default";
    case "approved":
      return "success";
    case "finished":
      return "error";
    default:
      return "default";
  }
};

const getPaymentColor = (payment_status) => {
  switch (payment_status) {
    case "pending":
      return "default";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};
