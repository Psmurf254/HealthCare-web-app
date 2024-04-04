import React from "react";
import { Grid, Typography } from "@mui/material";
import ExerciseCard from "./ExerciseCard";

const Exercises = ({ selectedCategory, exercises }) => {
  return (
    <div>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="primary"
        textAlign="center"
        mt={3}
        mb={2}
      >
        {selectedCategory} Results
      </Typography>

      <Grid container spacing={2}>
        {exercises.map((data, index) => (
          <Grid key={index} item xs={6} sm={6} md={4} lg={3}>
            <ExerciseCard data={data} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Exercises;
