import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  Paper,
} from "@mui/material";
import Person from "@mui/icons-material/Person";
import AttachMoney from "@mui/icons-material/AttachMoney";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isSameDay } from "date-fns";
import { apiProxy } from "../utils/constants";

const AppointmentForm = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [loading, setLoading] = useState(false);
  const [specialistDetails, setSpecialistDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [countdown, setCountdown] = useState(60);

  const filterAvailableTimes = useCallback(
    (selectedDate) => {
      console.log("Selected Date:", selectedDate);
      const isToday = isSameDay(selectedDate, new Date()); 

      const bookedTimes = appointments
        .filter((appointment) => {
          const appointmentDate = new Date(appointment.date_time);
          // Check if the appointment date matches the selected date
          return isSameDay(appointmentDate, selectedDate);
        })
        .map((appointment) => {
          const appointmentHour = new Date(appointment.date_time).getUTCHours();
          // Adjust the hour to account for the four-hour difference
          return (appointmentHour + 4) % 24;
        }); // Get the hours component in UTC time

      const allTimes = Array.from({ length: 24 }, (_, index) => index);
      let availableTimes = allTimes.filter(
        (hour) => !bookedTimes.includes(hour)
      );

      if (isToday) {
        const currentHour = (new Date().getUTCHours() + 4) % 24;
        availableTimes = availableTimes.filter((hour) => hour >= currentHour);
      }

      setAvailableTimes(availableTimes);
    },
    [appointments]
  );
  console.log(bookedDates);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/specialists/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const specialistData = await response.json();
        setSpecialistDetails(specialistData);
      } catch (error) {
        console.error("Error fetching specialist details:", error.message);
        setErrorMessage("Error fetching specialist details. Please try again.");
        setErrorDialogOpen(true);
      }
    };

    fetchSpecialistDetails();
  }, [id, token, navigate]);

  // Fetch the specialist appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${apiProxy}/api/specialist_appointments/${id}`,
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
        setAppointments(data);

        // Extract booked dates from appointments
        const bookedDates = data.map(
          (appointment) => new Date(appointment.date_time)
        );
        setBookedDates(bookedDates);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [id, token]);

  useEffect(() => {
    // Filter available times when selectedDate changes
    filterAvailableTimes(selectedDate);
  }, [selectedDate, appointments, filterAvailableTimes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setCountdown(60);

    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const formattedTime = time.split(":")[0];

      const dateTimeString = `${formattedDate} ${formattedTime}:00`;
      setLoading(true);
      console.log(`date time formated ${formattedDate} ${time}`);
      // Combine booking and payment data in a single payload
      const payload = {
        specialist: id,
        date_time: dateTimeString,
        description: description,
        phone_number: phone_number,
        amount: specialistDetails ? specialistDetails.pricing : 0,
        transaction_id: "0000",
      };

      // Send data to create endpoint
      const response = await fetch(`${apiProxy}/api/appointments/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // Appointment created successfully, now wait for transaction details
      await waitForTransaction(responseData.appointment_id);
    } catch (error) {
      console.error("Error booking appointment:", error.message);

      setErrorMessage("Error booking appointment. Please try again.");
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const waitForTransaction = async (appointmentId) => {
    const MAX_ATTEMPTS = 30;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      try {
        const response = await fetch(
          `${apiProxy}/api/payment_waiting/${appointmentId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === "completed") {
          setTransactionDetails({
            amount_received: data.amount_received,
            transaction_id: data.transaction_id,
          });
          setSuccessDialogOpen(true);
          return;
        }
      } catch (error) {
        console.error("Error waiting for transaction:", error.message);
        setErrorMessage("Error waiting for transaction. Please try again.");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }
    // Show error modal only when all attempts have been completed
    setErrorMessage("Transaction timed out. Please try again later.");
    setErrorDialogOpen(true);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    setPhone_number("");
    navigate("/");
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  return (
    <Stack mt={3} p={2}>
      <Stack
        sx={{
          padding: 3,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          flexDirection: { lg: "row", md: "row", sm: "column", xm: "column" },
          justifyContent: "space-around",
          gap: "20px",
        }}
      >
        <Stack maxWidth="450px">
          <Box
            border={1}
            p={2}
            sx={{
              width: { lg: 400, sm: 350, xm: 350 },
              alignItems: "center",
              alignContent: "center",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h6" color="text.primary">
              Booking Form
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleFormSubmit}>
              <Box display="flex" justifyContent="space-between" mt={5}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  filterDate={filterDate}
                />
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  {availableTimes.map((hour) => (
                    <option key={hour} value={`${hour}:00`}>
                      {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                    </option>
                  ))}
                </select>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={4}
                  sx={{ marginBottom: 2, width: "100%" }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" color="text.primary">
                Payment Form
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box>
                <TextField
                  label="Mpesa number"
                  value={phone_number}
                  onChange={(e) => setPhone_number(e.target.value)}
                  multiline
                  rows={1}
                  sx={{ marginBottom: 2, width: "100%" }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box textAlign="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || countdown <= 0}
                  >
                    {loading
                      ? countdown > 0
                        ? `Processing ${countdown}s`
                        : "Processing..."
                      : "Book Appointment"}
                  </Button>
                </Button>
              </Box>
            </form>
          </Box>

          {/* Success Dialog */}
          <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
            <DialogTitle color="success">Success</DialogTitle>
            <DialogContent>
              <Typography sx={{ color: "success" }}>
                Payment completed successfully! Details:
              </Typography>
              {transactionDetails && (
                <Stack gap={2} mt={2}>
                  <Typography variant="body1" color="success">
                    Amount Received: {transactionDetails.amount_received}
                  </Typography>
                  <Typography variant="body1" color="success">
                    Transaction ID: {transactionDetails.transaction_id}
                  </Typography>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSuccessDialogClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Error Dialog */}
          <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
            <DialogActions>
              <Button onClick={handleErrorDialogClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        <Stack>
          <Box
            border={1}
            p={2}
            sx={{
              width: { lg: 400, sm: 350, xm: 350 },
              alignItems: "center",
              alignContent: "center",
              borderRadius: "5px",
            }}
          >
            <Typography variant="h6" color="text.primary" position="relative">
              Booking Summary
              <Link to="/">
                <IconButton
                  sx={{
                    border: "2px solid purple",
                    p: "3px 25px",
                    borderRadius: "5px",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <Typography color="text.secondary" fontSize="12px" mr={1}>
                    Home
                  </Typography>
                  <NavigateNextIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Link>
            </Typography>
            <Divider sx={{ my: 2 }} />

            {loading ? (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            ) : specialistDetails ? (
              <div>
                <Stack mt={2} gap={2}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="Purple"
                      display="inline-flex"
                      gap={2}
                    >
                      <Person /> Specialist: {specialistDetails.full_name}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="Purple"
                      display="inline-flex"
                      gap={2}
                    >
                      <MedicalServicesIcon /> Service Request : Booking
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                    >
                      <AttachMoney sx={{ mr: 1 }} /> Amount To Pay: ksh{" "}
                      <span style={{ color: "red", fontSize: "20px" }}>
                        {" "}
                        {specialistDetails.pricing}{" "}
                      </span>
                    </Typography>
                  </Paper>

                  <Typography variant="body2" color="purple">
                    Booking Instructions:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2 }}
                  >
                    - Make sure you enter the correct details including M-PESA
                    number in the booking form.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2 }}
                  >
                    - After form submission, you will be prompted with an M-PESA
                    Prompt to enter your M-PESA Pin.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2 }}
                  >
                    - On successful completion, you will receive a confirmation
                    message with payment details.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ pl: 2 }}
                  >
                    - Click the home button to return to the home page.
                  </Typography>
                </Stack>
              </div>
            ) : (
              <Typography color="text.secondary">
                No specialist details available
              </Typography>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AppointmentForm;
