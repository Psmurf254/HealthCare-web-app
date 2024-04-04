import { Stack, Box } from "@mui/material";
import Siderbar from "./Siderbar";
import Content from "./Content";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiProxy } from "../../utils/constants";
import Appointments from "./Appointments";

const Feeds = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Profile");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/patients/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/patient/account/create");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [token, navigate]);

  return (
    <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
      <Box sx={{ borderRight: "1px solid red", padding: "15px", backgroundColor: '#FAF9F6' }}>
        <Siderbar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </Box>

      <Box sx={{ margin: 2, overflowY: "auto", height: "90vh", flex: 2 }}>
        <Content selectedItem={selectedItem} patientData={patient} token={token} setPatient={setPatient} 
        appointmentsData={appointments} setAppointments={setAppointments}/>
      </Box>
      <Box display='none'><Appointments appointments={appointments} setAppointments={setAppointments} token={token} /></Box>
      
    </Stack>
  );
};

export default Feeds;
