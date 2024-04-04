import {
  CardMedia,
  Box,
  Stack,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ExerciseVideos from "./ExerciseVideos";
import RelatedExercises from "./RelatedExercises";
import { fetchData, fetchFromAPI, exerciseOptions } from "./ApiForm";

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exerciseDetail, setExerciseDetail] = useState({});
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const [equipmentExercises, setEquipmentExercises] = useState([]);

  const searchTerm = exerciseDetail.name;
  const [videos, setVideos] = useState(null);

  const exerciseDbUrl = "https://exercisedb.p.rapidapi.com";

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const exerciseDetailData = await fetchData(
          `${exerciseDbUrl}/exercises/exercise/${id}`,
          exerciseOptions
        );
        const targetMuscleExercisesData = await fetchData(
          `${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`,
          exerciseOptions
        );
        setTargetMuscleExercises(targetMuscleExercisesData);

        const equimentExercisesData = await fetchData(
          `${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`,
          exerciseOptions
        );
        setEquipmentExercises(equimentExercisesData);

        fetchFromAPI(`search?part=snippet&q=${searchTerm}`).then((data) =>
          setVideos(data.items)
        );

        if (
          exerciseDetailData &&
          Object.keys(exerciseDetailData).length !== 0
        ) {
          setExerciseDetail(exerciseDetailData);
        }
      } catch (error) {
        console.error("Error fetching exercise detail data:", error);
      }
      setVideos(null);
    };

    fetchExercisesData();
  }, [id, searchTerm]);

  if (!videos?.length) {
    return (
      <Stack textAlign="center" padding="14px" alignItems="center" mb="50px">
        <CircularProgress color="secondary" />
      </Stack>
    );
  }

  return (
    <Stack
      direction="column"
      gap={10}
      mt="50px"
      ml="20px"
      mr="20px"
      sx={{ width: { xm: "90%" } }}
    >
      <Typography
        sx={{
          fontSize: { lg: "24px", xm: "17px", md: "17px" },
          fontWeight: "600",
        }}
      >
        {exerciseDetail.name}
        <span style={{ color: "#Ff2625" }}> Details</span>
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap={5}
        mb="50px"
      >
        <Box sx={{ bgcolor: "#f0f0f0", p: 2 }}>
          <CardMedia>
            <img
              src={exerciseDetail.gifUrl}
              alt={exerciseDetail.name}
              loading="lazy"
              width="300px"
              height="250px"
            />
          </CardMedia>
        </Box>
        <Stack
          sx={{
            maxWidth: "700px",
            p: "14px",
            lineHeight: 2,
          }}
        >
          {exerciseDetail.instructions}

          {exerciseDetail.secondaryMuscles && (
            <Box>
              <Typography
                sx={{ fontWeight: "600", mt: "30px", color: "red" }}
              ></Typography>
              <Stack gap={5}>
                {exerciseDetail.secondaryMuscles.map((muscle, index) => (
                  <Typography key={index} mt={-4}>
                    {muscle}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>

      <Box sx={{ minHeight: "50vh" }}>
        <Typography
          mb={4}
          sx={{
            fontSize: { lg: "24px", xm: "17px", md: "17px" },
            fontWeight: "600",
          }}
        >
          {exerciseDetail.name} <span style={{ color: "#Ff2625" }}>Videos</span>
        </Typography>
        <Grid container spacing={2}>
          {videos?.map((video) => (
            <Grid item xs={6} sm={6} md={4} lg={3}>
              <ExerciseVideos video={video} key={video.id} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ minHeight: "50vh", mb: "200px" }}>
        <Typography
          sx={{
            fontSize: { lg: "24px", xm: "17px", md: "17px" },
            fontWeight: "600",
            mr: "20px",
          }}
        >
          Similar Muscle <span style={{ color: "#Ff2625" }}>Target</span>
        </Typography>
        <Typography>
          {targetMuscleExercises.length !== 0 ? (
            <RelatedExercises relatedExercises={targetMuscleExercises} />
          ) : (
            <Stack
              textAlign="center"
              padding="14px"
              alignItems="center"
              mb="50px"
            >
              <CircularProgress color="secondary" />
            </Stack>
          )}
        </Typography>
        <Typography
          mt={3}
          sx={{
            fontSize: { lg: "24px", xm: "17px", md: "17px" },
            fontWeight: "600",
          }}
        >
          Similar Equipment <span style={{ color: "#Ff2625" }}>Target</span>
        </Typography>
        <Typography>
          {equipmentExercises.length !== 0 ? (
            <RelatedExercises relatedExercises={equipmentExercises} />
          ) : (
            <Stack
              textAlign="center"
              padding="14px"
              alignItems="center"
              mb="50px"
            >
              <CircularProgress color="secondary" />
            </Stack>
          )}
        </Typography>
      </Box>
    </Stack>
  );
};

export default ExerciseDetail;
