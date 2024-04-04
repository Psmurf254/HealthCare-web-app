import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import VideoChatIcon from "@mui/icons-material/VideoChat";

const AppointmentCard = ({ appointment, openPatientInfoModal }) => {
  const { patientDetails, date_time, description, status, countdownTimer } =
    appointment;

  return (
    <TableRow key={appointment.id}>
      <TableCell>
        <Typography
          fontSize="small"
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => openPatientInfoModal(patientDetails)}
        >
          {patientDetails.full_name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography fontSize="small" />{" "}
        {new Date(date_time).toLocaleString("en-US", {
          timeZone: "America/New_York",
        })}
      </TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>
        <Chip label={status} color={getStatusColor(status)} />
      </TableCell>
      <TableCell>
          {status === "approved" && (
            // Test button
            <IconButton
            component={Link}
            to={`/specialist/meetings/${patientDetails.id}`}
          >
            <VideoChatIcon />
          </IconButton>

          )}
        {status === "approved" &&
          (countdownTimer.days === 0 &&
          countdownTimer.hours === 0 &&
          countdownTimer.minutes === 0 &&
          countdownTimer.seconds === 0 ? (
            <IconButton
              component={Link}
              to={`/specialist/meetings/${patientDetails.id}`}
            >
              <VideoChatIcon />
            </IconButton>
          ) : (
            <Typography>
              {countdownTimer.days > 0 && `${countdownTimer.days}d `}
              {countdownTimer.hours > 0 && `${countdownTimer.hours}h `}
              {countdownTimer.minutes > 0 && `${countdownTimer.minutes}m `}
              {countdownTimer.seconds}s
              <LinearProgress
                variant="determinate"
                value={calculateProgress(countdownTimer)}
              />
            </Typography>
          ))}
      </TableCell>
    </TableRow>
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

export default AppointmentCard;

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
