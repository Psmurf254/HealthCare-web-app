import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  IconButton,
} from "@mui/material";
import { blogsbg } from "../utils/constants";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { testimonialsettings } from "../utils/SlickSettings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Blogs = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const options = {
        method: "POST",
        url: "https://google-api31.p.rapidapi.com/",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "6430d7d4a3msh742c93506bac7aap106846jsne8be0f7127dd",
          "X-RapidAPI-Host": "google-api31.p.rapidapi.com",
        },
        data: {
          text: "Healthcare",
          region: "wt-wt",
          max_results: 25,
        },
      };

      try {
        const response = await axios.request(options);
        const responseData = response.data;
        setNews(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  console.log("Blogs", news);

  return (
    <section style={{ padding: "0" }} id="blogs">
      <section style={{ marginBottom: "-3%", overflowX: "hidden" }}>
        <Typography
          className="mainheading"
          sx={{
            fontSize: { lg: "20px", md: "18px", sm: "17px", xm: "17px" },
            fontWeight: "500",
            mb: "50px",
          }}
        >
          New <span>Blogs</span>
        </Typography>
      </section>
      <Stack>
        <Stack sx={{ p: "50px" }}>
          <Slider
            {...testimonialsettings}
            style={{ textAlign: "left", marginTop: "-20px" }}
          >
            {news.news &&
              news.news.map((article, index) => (
                <Card key={index} sx={{ mb: 2, Height: 350 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.image || blogsbg}
                  />

                  <CardContent>
                    <Typography gutterBottom variant="body1" component="div">
                      {article.title.slice(0, 35)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      lineHeight={1.8}
                    >
                      {article.body.slice(0, 150)}
                    </Typography>
                    <Typography color="purple" opacity="0.8" fontSize="12px">
                      {new Date(article.date).toLocaleDateString()}
                    </Typography>

                    <Box mt={2}>
                      <IconButton
                        sx={{
                          mt: 1,
                          border: "2px solid green",
                          p: "3px 30px",
                          borderRadius: "5px",
                        }}
                      >
                        <Typography
                          color="text.secondary"
                          fontSize="12px"
                          mr={1}
                        >
                          <Link
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read more{" "}
                          </Link>
                        </Typography>
                        <NavigateNextIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Slider>
        </Stack>
      </Stack>
    </section>
  );
};

export default Blogs;
