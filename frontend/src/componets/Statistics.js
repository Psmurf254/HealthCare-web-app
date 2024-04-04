import React, { useEffect } from "react";
import { Stack, Typography, Card, CardContent, CardMedia, Box} from "@mui/material";
import { statistics } from "../utils/constants";
import AOS from 'aos';
import 'aos/dist/aos.css';


const Statistics = () => {

  useEffect(() => {
    AOS.init({duration: 2000})
  }, []);

  
  return (
    <section style={{ padding: "0", overflowX: "hidden" }} id="reviews">
      <Stack
        sx={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(221, 221, 221, 0.1))",
          minHeight: "50vh",
          padding: 3,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
        
      >
        <Box data-aos="fade-down">
        <Typography variant="h3" mt={2} fontWeight={600}>
          Health360 <span style={{ color: "red" }}>in</span> Numbers
        </Typography>
        <Typography
          mt={1}
          variant="div"
          fontFamily="sans-serif"
          lineHeight={2}
          color="text.secondary"
          sx={{ maxWidth: { lg: "60%" } }}
          
        >
          Dynamically target high-payoff intellectual capital for customized
          technologies. Objectively integrate emerging core competencies.
        </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={4}
          mt={4}
          alignItems="center"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          {statistics.map((statistic) => (
            <Card
              key={statistic.id}
              sx={{
                width: { lg: 280, md: 280, sm: 400, xm: 400 },
                height: 300,
                textAlign: "center",
                p: 4,
              }}
              data-aos="flip-left"
            >
              <CardMedia
                component="img"
                image={statistic.icon}
                alt={statistic.name}
                sx={{ margin: "auto", width: "50px" }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {statistic.name}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                  {statistic.total}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {statistic.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </section>
  );
};

export default Statistics;
