import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

const Overview = ({ patientData }) => {
  console.log("patient data", patientData);
  return (
    <Stack>
      {patientData.map((patient, index) => (
        <Stack
          direction="row"
          justifyContent="start"
          flexWrap="wrap"
          gap={4}
          flexBasis="50%"
          alignContent="stretch"
        >
          <Stack className="OverviewBox" key={index}>
            <Box display="flex" flexDirection="column" textAlign="center">
              <Avatar
                alt="User Avatar"
                src={patient.profile_picture}
                sx={{ width: 100, height: 100, marginBottom: 2 }}
              />
              <Box textAlign="left" alignItems="left">
                <Typography variant="h5" gutterBottom>
                  {patient.full_name}
                </Typography>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    {patient.contact_phone}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {patient.contact_email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>

          <Stack className="OverviewBox">
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={7}
              textAlign="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Gender
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.gender}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Date of Birth
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.date_of_birth}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Ecn
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.emergency_contact_name}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Ecn
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.emergency_contact_phone}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Heart Rate
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.heart_rate}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="gray"
                  textTransform="uppercase"
                  mb={1}
                >
                  Weight
                </Typography>
                <Typography variant="body5" weight="600">
                  {patient.weight}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack
            className="OverviewBox"
            minWidth="67%"
            border="none"
            borderTop="1px solid gray"
          >
            <Typography variant="h5" weight="600" color="red" mb={3}>
              Medications
            </Typography>
            <ul>
              {patient.medications.split("\n").map((medication, i) => (
                <li key={i}>
                  <Typography>{medication}</Typography>
                </li>
              ))}
            </ul>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default Overview;
