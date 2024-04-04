import { Stack, Box } from "@mui/material";
import Siderbar from "./Sidebar";
import Content from "./Content";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiProxy } from "../../utils/constants";
import Appointments from "./Appointments";
import SpecialistStatisticsForm from "./SpecialistStatisticsForm";

const SFeeds = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [specialist, setSpecialist] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Profile");
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchSpecialistData = async () => {
      try {
        const response = await fetch(
          `${apiProxy}/api/specialists/specialist/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/specialist/account/create");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const data = await response.json();
        setSpecialist(data);
      } catch (error) {
        console.error("Error fetching specialist data:", error);
      }
    };

    fetchSpecialistData();
  }, [token, navigate]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/specialist_feedback/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch feedbacks! Status: ${response.status}`
          );
        }

        const data = await response.json();
        // Filter feedbacks for the specialist ID
        const specialistFeedbacks = data.filter(
          (feedback) => feedback.specialist === specialist[0]?.id
        );
        setFeedbacks(specialistFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [token, specialist.id, specialist]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ padding: "15px", borderRight: "1px solid green" }}>
        <Siderbar
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </Box>
      <Box
        sx={{ margin: 2, mr: 0, overflowY: "auto", height: "90vh", flex: 2 }}
      >
        <Content
          selectedItem={selectedItem}
          token={token}
          specialistData={specialist}
          setSpecialist={setSpecialist}
          feedbacks={feedbacks}
          setAppointments={setAppointments}
          appointments={appointments}
        />
      </Box>
      <Box display="none">
        <Appointments
          token={token}
          feedbacks={feedbacks}
          setAppointments={setAppointments}
          appointments={appointments}
        />
        <SpecialistStatisticsForm
          token={token}
          feedbacks={feedbacks}
          appointments={appointments}
        />
      </Box>
    </Stack>
  );
};

export default SFeeds;
