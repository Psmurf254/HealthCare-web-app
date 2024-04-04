import React, { useEffect, useState } from "react";
import { Box, Stack, CircularProgress, Alert } from "@mui/material";
import Category from "./Category";
import Exercises from "./Exercises";
import { fetchData, exerciseOptions } from "./ApiForm";

const ExerciseFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const categoryData = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          exerciseOptions
        );
        setCategories(categoryData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Error fetching initial data. Please try again.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchExercisesData = async () => {
      setLoading(true);
      try {
        let updatedExercises = [];

        if (selectedCategory !== undefined) {
          if (selectedCategory === "All") {
            updatedExercises = await fetchData(
              "https://exercisedb.p.rapidapi.com/exercises",
              exerciseOptions
            );
          } else {
            const bodyPartList = await fetchData(
              "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
              exerciseOptions
            );

            const isValidBodyPart = bodyPartList.includes(
              selectedCategory?.toLowerCase()
            );

            if (isValidBodyPart) {
              updatedExercises = await fetchData(
                `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedCategory?.toLowerCase()}`,
                exerciseOptions
              );
            } else {
              console.error(`Invalid body part: ${selectedCategory}`);
              setError(`Invalid body part: ${selectedCategory}`);
              setLoading(false);
              return;
            }
          }

          setExercises(Array.isArray(updatedExercises) ? updatedExercises : []);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        setError("Error fetching exercise data. Please try again.");
        setLoading(false);
      }
    };

    fetchExercisesData();
  }, [selectedCategory]);

  return (
    <Box>
      <Stack>
        {loading && (
          <Stack
            direction="row"
            justifyContent="center"
            mt={5}
            alignItems="center"
            width="100%"
          >
            {" "}
            <CircularProgress />{" "}
          </Stack>
        )}
        {error && (
          <Stack
            direction="row"
            justifyContent="center"
            mt={5}
            alignItems="center"
            width="100%"
          >
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
        {!loading && !error && (
          <>
            <Category
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              search={search}
              setSearch={setSearch}
              setExercises={setExercises}
              initialExercises={exercises}
              categories={categories}
            />
            <hr />
            <Exercises
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              search={search}
              setSearch={setSearch}
              exercises={exercises}
              setExercises={setExercises}
              initialExercises={exercises}
              loading={loading}
              error={error}
            />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ExerciseFeed;
