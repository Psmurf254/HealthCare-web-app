import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Rating,
} from "@mui/material";

const CreateReview = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review_text, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ rating, review_text });
      setRating("");
      review_text("");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Review
        </Typography>
        <Box mt={2}>
          <Rating
            name="rating"
            value={rating}
            onChange={handleRatingChange}
            sx={{ fontSize: "35px" }}
          />
        </Box>
        <TextField
          label="Review"
          multiline
          rows={4}
          fullWidth
          value={review_text}
          onChange={handleReviewTextChange}
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Submitting" : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateReview;
