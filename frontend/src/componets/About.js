import React, { useState, useEffect} from "react";
import {
  Typography,
  Box,
  Stack,
  CardMedia,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";

import {
  Commitment,
  Philosophy,
  impact,
  vision,
  apiProxy,
} from "../utils/constants";
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = ({ about }) => {
  const initialTextLimit = 40;
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiProxy}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          phone_number: "",
          email: "",
          message: "",
        });
        alert("Message sent successfully!");
      } else {
        const errorMessage = await response.text();
        setError("Something went wrong! Try again later");
        console.error("Failed to send the message:", errorMessage);
      }
    } catch (error) {
      console.error("Error in sending the message:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [textLimits, setTextLimits] = useState({
    impact: initialTextLimit,
    commitment: initialTextLimit,
    vision: initialTextLimit,
    philosophy: initialTextLimit,
  });

  const handleReadMore = (cardKey) => {
    setTextLimits((prevLimits) => ({
      ...prevLimits,
      [cardKey]:
        prevLimits[cardKey] === initialTextLimit ? Infinity : initialTextLimit,
    }));
  };

  const aboutCards = [
    {
      key: "impact",
      icon: impact,
      heading: "Our Impact",
      body: about.impact,
    },
    {
      key: "commitment",
      icon: Commitment,
      heading: "Our Commitment",
      body: about.commitment,
    },
    {
      key: "vision",
      icon: vision,
      heading: "Our Vision",
      body: about.vision,
    },
    {
      key: "philosophy",
      icon: Philosophy,
      heading: "Our Philosophy",
      body: about.philosophy,
    },
  ];

  useEffect(() => {
    AOS.init({duration: 2000})
  }, []);


  return (
    <section style={{ marginTop: "0", position: "relative" }} id="About">
      <Typography
        className="mainheading"
        sx={{
          fontSize: { lg: "20px", md: "18px", sm: "17px", xm: "17px" },
          fontWeight: "500",
        }}
      >
        About <span>us</span>
      </Typography>

      <Box sx={{ width: { lg: "70%", xm: "100%", sm: "100%" } }} mt={4}>
        <Typography>
          {`At Health 360, we are dedicated to elevating the standards of healthcare through innovative practices 
          and a commitment to excellence. Our team of highly skilled medical practitioners is driven by the mission 
          to provide personalized, top-tier care to every individual. We embrace the latest advancements in medical science, 
          ensuring that our patients have access to cutting-edge treatments and technologies. From preventive care to complex medical
          interventions, Health 360 is your trusted partner in achieving optimal health and well-being.`
            .split(" ")
            .slice(0, textLimits.impact)
            .join(" ")}
          {textLimits.impact === initialTextLimit ? (
            <span
              onClick={() => handleReadMore("impact")}
              style={{ color: "blue", cursor: "pointer" }}
            >
              ...Read More
            </span>
          ) : (
            <span
              onClick={() => handleReadMore("impact")}
              style={{ color: "blue", cursor: "pointer" }}
            >
              {" "}
              Read Less
            </span>
          )}
        </Typography>

        <Stack
          direction="row"
          flexBasis="50%"
          flexWrap="wrap"
          gap={3}
          mt="25px"
        >
          {aboutCards.map((card) => (
            <Box key={card.key} className="AboutCard"  data-aos="fade-up">
              <CardMedia sx={{ display: "flex", gap: "20px" }}>
                <div>
                  <img
                    src={card.icon}
                    alt="icon"
                    width="45px"
                    height="45px"
                    style={{ padding: "7px" }}
                   
                  />
                  
                </div>
                <Typography
                  variant="body2"
                  color="red"
                  fontWeight="600"
                  textTransform="uppercase"
                  lineHeight={3}
                >
                  {card.heading}
                </Typography>
              </CardMedia>
              <Typography mt="7px" lineHeight={2} variant="body2">
                {card.body.split(" ").slice(0, textLimits[card.key]).join(" ")}
                {textLimits[card.key] === initialTextLimit ? (
                  <span
                    onClick={() => handleReadMore(card.key)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    ...Read More
                  </span>
                ) : (
                  <span
                    onClick={() => handleReadMore(card.key)}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    {" "}
                    Read Less
                  </span>
                )}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Stack
        sx={{
          position: { lg: "absolute" },
          backgroundColor: "#008080",
          minHeight: "50vh",
          right: "1%",
          top: "12%",
          padding: "12px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
          mt: 3,
        }}
        data-aos="fade-left"
      >
        <Box>
          <Typography
            variant="h5"
            color="#fff"
            lineHeight={1.7}
            textTransform="uppercase"
          >
            Let's Connect....
          </Typography>
          <Divider my={2} />
          <form onSubmit={handleSubmit}>
            <Stack gap={3} width={350} padding="55px 15px">
              <TextField
                type="tel"
                name="phone_number"
                label="Phone Number"
                variant="outlined"
                fullWidth
                required
                value={formData.phone_number}
                onChange={handleChange}
              />
              <TextField
                type="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                name="message"
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                required
                value={formData.message}
                onChange={handleChange}
              />
              {error && (
                <Box sx={{ textAlign: "center", mt: "40px" }}>
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </section>
  );
};

export default About;
