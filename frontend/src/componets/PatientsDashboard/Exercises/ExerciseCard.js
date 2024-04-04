import { Stack, CardMedia, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ExerciseCard = ({ data }) => {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 2,
        flexWrap: "wrap",
        mt: 3,
        width: '100%',
        
      }}
    >
      <Box sx={{ bgcolor: '#f0f0f0', p: 2 }}>
        <Link to={`/exercise/${data.id}`}>
          <CardMedia style={{ objectFit: "cover" }}>
            <img
              src={data.gifUrl}
              alt={data.name}
              loading="lazy"
              height='250px'
              sx={{ objectFit: "cover", maxWidth: { lg: 250, md: 250 } }}
              width='100%'
            />
            <Typography variant="body1" color='secondary' mt={1}>
            {data.name.slice(0, 20)}
            </Typography>
          </CardMedia>
        </Link>
      </Box>
    </Stack>
  );
};

export default ExerciseCard;
