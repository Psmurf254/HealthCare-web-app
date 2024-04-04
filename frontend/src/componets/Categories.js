import { Typography, Box, Button, Stack } from "@mui/material";
import { settings } from "../utils/SlickSettings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Categories = ({ categories, selectedCategory, handleCategoryChange }) => {
  return (
    <section style={{ overflowX: "hidden", padding: 0 }} id="services">
      <Stack
        sx={{
          background:
            "linear-gradient(to bottom, rgba(128, 128, 128, 0.5), rgba(221, 221, 221, 0.1))",
          minHeight: "50vh",
          padding: 4,
          position: "relative",
        }}
      >
        <Typography
          className="mainheading"
          sx={{
            fontSize: { lg: "20px", md: "18px", sm: "17px", xm: "17px" },
            fontWeight: "500",
            mb: "50px",
          }}
        >
          our <span>services</span>
        </Typography>
        <hr />
        <Box
          sx={{
            mt: "15px",
          }}
        >
          <Slider {...settings} style={{ display: "flex", gap: 2 }}>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outlined"
                color={selectedCategory === category.id ? "error" : "primary"}
                onClick={() => handleCategoryChange(category.id)}
                sx={{ zIndex: 2 }}
              >
                {category.name}
              </Button>
            ))}
          </Slider>
        </Box>
      </Stack>
    </section>
  );
};

export default Categories;
