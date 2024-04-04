import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CircularProgress,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Box,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";

const DietFeed = () => {
  const [searchQuery, setSearchQuery] = useState("All");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    const options = {
      method: "GET",
      url: "https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2",
      params: {
        type: "public",
        q: searchQuery,
      },
      headers: {
        "Accept-Language": "en",
        "X-RapidAPI-Key": "6430d7d4a3msh742c93506bac7aap106846jsne8be0f7127dd",
        "X-RapidAPI-Host": "edamam-recipe-search.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setRecipes(response.data.hits);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} mt={5} mx={2}>
      <Box
        sx={{ width: { lg: "50%", md: "50%", sm: "100%", xm: "100%" } }}
        display="inline-flex"
      >
        <TextField
          label="Search Recipe"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button variant="contained" onClick={handleSearch} sx={{ ml: "-19px" }}>
          Search
        </Button>
      </Box>
      <hr />
      <Box sx={{ textAlign: "center", mt: "40px" }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      <Stack
        gap={5}
        sx={{ flexDirection: { lg: "row", md: "row" } }}
        flexWrap="wrap"
        justifyContent="start"
      >
        {recipes.map((recipe, index) => (
          <Link to={`/recipe/${recipe.recipe.label}`} key={index}>
            <Card
              className="RecipeCard"
              key={index}
              style={{
                width: "300px",
                marginTop: "15px",
                borderRadius: "5px",
                transition: ".5s",
              }}
            >
              <CardMedia
                component="img"
                alt={recipe.recipe.label}
                height="140"
                image={recipe.recipe.image}
              />
              <CardContent>
                <Typography fontSize="14px" color="brown" fontWeight="600">
                  {recipe.recipe.label.slice(0, 100)}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
};

export default DietFeed;
