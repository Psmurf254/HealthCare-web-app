import { Box, CardMedia, Stack, Typography } from "@mui/material";
import { HeaderImage1, HeaderImage2, HeaderImage3 } from "../utils/constants";
import Slider from "react-slick";

const generateHeaderImageStyle = (image) => ({
  backgroundImage: `linear-gradient(rgba(4,9,30,0.2), rgba(4,9,30,0.2)), url(${image})`,
  width: "100%",
  backgroundSize: "cover",
  position: "relative",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const Header = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <Stack className="Header" sx={{ position: "relative" }}>
      <Slider {...settings}>
        {[HeaderImage1, HeaderImage2, HeaderImage3].map((image, index) => (
          <Box key={index}>
            <CardMedia
              style={generateHeaderImageStyle(image)}
              className="heroimg"
              sx={{
                minHeight: { lg: "85vh", md: "85vh" },
              }}
            />
          </Box>
        ))}
      </Slider>
      <Box className="HeroText"></Box>
      <Box className="HeroTextContent">
        <Typography
          sx={{
            fontSize: { lg: "27px", md: "22px", sm: "27px", xm: "27px" },
            fontWeight: "600",
            mb: "1rem",
            textTransform: "uppercase",
            color: "#fff",
          }}
        >
          {" "}
          Health 360
          <span
            style={{
              marginLeft: "12px",
            }}
          >
            Your Personalized Path to Wellness
          </span>
        </Typography>
        <Typography
          sx={{
            fontSize: { lg: "17px", md: "15px", sm: "14px", xm: "14px" },
            textTransform: "capitalize",
            lineHeight: "34px",
            color: "yellow",
            opacity: "0.8",
            fontWeight: "300",
          }}
        >
          Tailored health plans designed to meet your unique needs, fostering a
          holistic approach to your well-being
        </Typography>
        <a href="#services">
          <button className="headerButton">Get Started</button>
        </a>
      </Box>
    </Stack>
  );
};

export default Header;
