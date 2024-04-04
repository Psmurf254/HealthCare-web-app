import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  CardContent,
  CardMedia,
  CircularProgress,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { avatar } from "../utils/constants";
import { testimonialsettings } from "../utils/SlickSettings";
import { apiProxy } from "../utils/constants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CreateReview from "../pages/CreateReview";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const Reviews = ({ token }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/reviews/`);
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const data = await response.json();

        // Fetch user details for each testimonial
        const testimonialsWithDetails = await Promise.all(
          data.map(async (testimonial) => {
            try {
              const userResponse = await fetch(
                `${apiProxy}/api/review/${testimonial.user}/`
              );
              if (!userResponse.ok) {
                throw new Error(
                  `Failed to fetch user details for testimonial ID ${testimonial.id}`
                );
              }
              const userData = await userResponse.json();

              return {
                ...testimonial,
                userFullName: userData?.full_name,
                userPhoto: userData?.profile_picture,
              };
            } catch (error) {
              console.error(
                "Error fetching user details for testimonial:",
                error
              );

              return {
                id: testimonial.id,
              };
            }
          })
        );

        setTestimonials(testimonialsWithDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleCreateReview = async (reviewData) => {
    try {
      const response = await fetch(`${apiProxy}/api/review/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error("Failed to create review");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <section style={{ padding: "0", overflowX: "hidden" }} id="reviews">
      <Stack
        sx={{
          background:
            "linear-gradient(to bottom, rgba(128, 128, 128, 0.5), rgba(221, 221, 221, 0.1))",
          minHeight: "50vh",
          padding: 3,
          position: "relative",
        }}
      >
        <Typography variant="h3" mt={2} fontWeight={600}>
          Patient <span style={{ color: "red" }}>testimonials</span>
        </Typography>
        <Typography
          mt={1}
          variant="div"
          fontFamily="sans-serif"
          lineHeight={2}
          color="text.secondary"
          sx={{ maxWidth: { lg: "60%" } }}
        >
          It’s often said that word of mouth is the most reliable advice one can
          receive. At our establishment, we take pride in the positive feedback
          we've received from our satisfied clients.
        </Typography>
        <Box position="absolute" right={0} top={-12}>
          {token && (
            <IconButton
              onClick={() => setIsModalOpen(true)}
              sx={{
                backgroundColor: "#D4D4D4",
                p: "10px",
                borderRadius: "20px",
                color: "blue",
                mt: 2,
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 25 }} />
            </IconButton>
          )}
        </Box>
      </Stack>

      <Stack mt={-5}>
        {loading ? (
          <Box sx={{ textAlign: "center", mt: "40px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Slider
            {...testimonialsettings}
            style={{ textAlign: "left", marginTop: "0" }}
          >
            {testimonials.map((testimonial, index) => (
              <Box sx={{ maxWidth: 400 }} key={index}>
                <CardMedia
                  sx={{
                    borderRadius: "0 0 50px 50px",
                    width: "25%",
                    ml: "150px",
                  }}
                >
                  <Avatar
                    alt={testimonial.userFullName}
                    src={testimonial.userPhoto || avatar}
                    sx={{ width: 85, height: 85 }}
                  />
                </CardMedia>

                <CardContent>
                  <FormatQuoteIcon sx={{ color: "#008080", fontSize: 25 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.5}
                    mb={2}
                  >
                    {testimonial.review_text}
                  </Typography>
                  <Typography
                    variant="div"
                    fontSize="17px"
                    color="purple"
                    gutterBottom
                  >
                    {testimonial.userFullName}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: "10px", opacity: 0.8 }}
                  >
                    {new Date(testimonial.date).toLocaleString("en-KE", {
                      timeZone: "America/New_York",
                    })}
                  </Typography>
                </CardContent>
              </Box>
            ))}
          </Slider>
        )}

        <Box>
          <CreateReview
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateReview}
          />
        </Box>
      </Stack>
    </section>
  );
};

export default Reviews;
