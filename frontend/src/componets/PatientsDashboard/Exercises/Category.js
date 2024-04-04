import { Stack, Select, MenuItem } from "@mui/material";

const Category = ({
  selectedCategory,
  setSelectedCategory,
  setExercises,
  initialExercises,
  categories,
}) => {
  return (
    <Stack mb={3}>
      <Select
        value={selectedCategory}
        onChange={(event) => {
          const category = event.target.value;
          setSelectedCategory(category);

          const filteredExercises =
            category === "All"
              ? initialExercises
              : initialExercises.filter(
                  (exercise) => exercise.category === category
                );

          setExercises(filteredExercises);
        }}
        sx={{
          cursor: "pointer",
          width: "200px",
        }}
        color="secondary"
        variant="outlined"
      >
        {categories && Array.isArray(categories) ? (
          categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              <a href="#exercises">{category}</a>
            </MenuItem>
          ))
        ) : (
          <MenuItem value="All">All</MenuItem>
        )}
      </Select>
    </Stack>
  );
};

export default Category;
