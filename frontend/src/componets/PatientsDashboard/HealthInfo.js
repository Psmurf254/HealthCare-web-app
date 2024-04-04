import React from "react";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const HealthInfo = ({ patientData }) => {
  if (!patientData || patientData.length === 0) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        mt="1rem"
      >
        <CircularProgress />
      </Stack>
    );
  }

  const patient = patientData[0];
  const fieldsToDisplay = [
    { label: "Medical History", key: "medical_history" },
    { label: "Allergies", key: "allergies" },
    { label: "Medications", key: "medications" },
    { label: "Immunization Records", key: "immunization_records" },
    { label: "Prescription History", key: "prescription_history" },
  ];

  return (
    <Grid container spacing={3}>
      {fieldsToDisplay.map((field) => (
        <Grid item xs={12} md={6} lg={4} key={field.key}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {field.label}
              </Typography>
              <List>
                {patient[field.key]
                  ?.split("\n")
                  .filter((item) => item.trim() !== "")
                  .map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default HealthInfo;
