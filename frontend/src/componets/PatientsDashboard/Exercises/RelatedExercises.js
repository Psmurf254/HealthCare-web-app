import React from "react";
import ExerciseCard from "./ExerciseCard";
import { Grid } from "@mui/material";

const RelatedExercises = ({ relatedExercises }) => {
  const exercisesArray = Array.isArray(relatedExercises)
    ? relatedExercises
    : [];

  const firstThreeExercises = exercisesArray.slice(0, 6);

  return (
    <div>
      <Grid container spacing={2}>
        {firstThreeExercises.map((exercise, index) => (
          <Grid key={index} item xs={6} sm={6} md={4} lg={3}>
            <ExerciseCard key={exercise.id} data={exercise} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default RelatedExercises;
