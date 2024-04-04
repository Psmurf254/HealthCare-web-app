import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stack,
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Alert,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faClock,
  faWineGlassAlt,
} from "@fortawesome/free-solid-svg-icons";

const DietDetails = () => {
  const { label } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);

      const options = {
        method: "GET",
        url: "https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2",
        params: {
          type: "public",
          q: label,
        },
        headers: {
          "Accept-Language": "en",
          "X-RapidAPI-Key":
            "6430d7d4a3msh742c93506bac7aap106846jsne8be0f7127dd",
          "X-RapidAPI-Host": "edamam-recipe-search.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setRecipeDetails(response.data.hits[0].recipe);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (label) {
      fetchRecipeDetails();
    }
  }, [label]);

  return (
    <div>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {recipeDetails && (
        <Stack
          gap={5}
          flexWrap="wrap"
          sx={{
            flexDirection: { lg: "row", md: "row", sm: "column", xm: "column" },
            m: { lg: "50px", md: "50px", sm: "20px", xm: "20px" },
          }}
        >
          <Card sx={{ maxWidth: { lg: "500px" } }}>
            <CardMedia
              component="img"
              alt={recipeDetails.label}
              height="200"
              image={recipeDetails.image}
            />
            <CardContent>
              <Typography variant="h5">{recipeDetails.label}</Typography>
            </CardContent>

            <Box mt={2}>
              <List style={{ display: "flex", gap: "50px", overflowX: "auto" }}>
                <ListItem sx={{ textAlign: "center" }}>
                  <ListItemText
                    primary={
                      <Chip
                        icon={<FontAwesomeIcon icon={faUtensils} />}
                        label="Dish Type"
                        variant="outlined"
                        sx={{ mb: "7px" }}
                      />
                    }
                    secondary={recipeDetails.dishType.join(", ")}
                  />
                </ListItem>

                <ListItem sx={{ textAlign: "center" }}>
                  <ListItemText
                    primary={
                      <Chip
                        icon={<FontAwesomeIcon icon={faClock} />}
                        label="Total Time"
                        variant="outlined"
                        sx={{ mb: "7px" }}
                      />
                    }
                    secondary={`${recipeDetails.totalTime} minutes`}
                  />
                </ListItem>
                <ListItem sx={{ textAlign: "center" }}>
                  <ListItemText
                    primary={
                      <Chip
                        icon={<FontAwesomeIcon icon={faWineGlassAlt} />}
                        label="Cuisine Type"
                        variant="outlined"
                        sx={{ mb: "7px" }}
                      />
                    }
                    secondary={recipeDetails.cuisineType.join(", ")}
                  />
                </ListItem>
              </List>
            </Box>
          </Card>

          <Card sx={{ maxWidth: 500, maxHeight: 450, overflowY: "auto" }}>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText primary="Ingredients:" />
                </ListItem>
                {recipeDetails.ingredientLines && (
                  <List>
                    {recipeDetails.ingredientLines.map((ingredient, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`- ${ingredient}`} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 950 }}>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText primary="Nutritional Information:" />
                </ListItem>
                {recipeDetails.digest && (
                  <List
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      textAlign: "center",
                      p: "10px",
                      overflowX: "auto",
                    }}
                  >
                    {recipeDetails.digest.map((nutrient, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${nutrient.label}: ${nutrient.total.toFixed(
                            2
                          )} ${nutrient.unit}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </List>
            </CardContent>
          </Card>
        </Stack>
      )}
    </div>
  );
};

export default DietDetails;
