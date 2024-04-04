import React, { useState, useEffect } from "react";
import {
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { apiProxy } from "../../utils/constants";

const SymptomsChecker = () => {
  const [diseases, setDiseases] = useState([]);
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/disease_data/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDiseases(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDiseaseData();
  }, []);

  const handleSearch = () => {
    const filtered = diseases.filter((disease) =>
      disease.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDiseases(filtered);
  };

  const handleDiseaseClick = (disease) => {
    setSelectedDisease(disease);
  };

  return (
    <Stack>
      <Box mb={2} display="inline-flex" textAlign="center">
        {loading && <CircularProgress />}
        {error && <p>Error: {error}</p>}
        <TextField
          label="Enter symptoms"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{ ml: "-7px" }}
        >
          Search
        </Button>
      </Box>
      <Divider my={2} />

      <Stack
        mt={2}
        sx={{
          flexDirection: { lg: "row", md: "row", sm: "column", xm: "column" },
          flexWrap: "warp",
          gap: "30px",
        }}
      >
        <Box maxWidth="200px">
          {filteredDiseases.length === 0 && searchTerm !== "" && (
            <Typography>No disease found matched your symptoms.</Typography>
          )}
          {filteredDiseases.map((disease) => (
            <Box key={disease.id}>
              <Card
                onClick={() => handleDiseaseClick(disease)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedDisease && selectedDisease.id === disease.id
                      ? "lightgrey"
                      : "white",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1">{disease.name}</Typography>{" "}
                  <ArrowForwardIcon />
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        {selectedDisease && (
          <Stack
            sx={{
              flexDirection: {
                lg: "row",
                md: "row",
                sm: "column",
                xm: "column",
              },
              flexWrap: "warp",
              gap: "30px",
            }}
          >
            <Box maxWidth="300px" maxHeight="300px" overflowY="auto">
              <Card>
                <CardContent>
                  <Typography variant="body1" color="primary">
                    Symptoms of {selectedDisease.name}
                  </Typography>
                  <Divider sx={{ marginTop: "5px" }} />

                  <List>
                    {selectedDisease.symptoms
                      .split(",")
                      .map((symptom, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={symptom.trim()} />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
            <Box maxWidth="300px" maxHeight="300px" overflowY="auto">
              <Card>
                <CardContent>
                  <Typography variant="body" color="primary" mb={2}>
                    Causes of {selectedDisease.name}
                  </Typography>
                  <Divider sx={{ marginTop: "5px" }} />

                  <List>
                    {selectedDisease.causes.split(",").map((cause, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={cause.trim()} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default SymptomsChecker;
