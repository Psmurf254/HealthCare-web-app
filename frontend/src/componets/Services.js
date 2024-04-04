import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Skeleton,
  CardMedia,
  IconButton,
} from "@mui/material";
import { apiProxy } from "../utils/constants";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = ({ specialists, loading }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentSpecialists = specialists.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    AOS.init({duration: 2000})
  }, []);


  return (
    <section style={{ marginTop: "-2%", overflowX: "hidden" }}>
      <Box mt={1}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: { lg: "1rem" },
            flexWrap: "wrap",
          }}
          className="serviceCard"
          data-aos="zoom-in"
         
        >
          {currentSpecialists.map((specialist) => (
            <Box
              key={specialist.id}
              sx={{
                maxWidth: { lg: 250, md: 250 },
                mt: -9,
              }}
              className="ServiceCard"
              data-aos="fade-up"
            >
              <Card>
                {loading ? (
                  <Skeleton variant="rectangular" height={300} />
                ) : (
                  <Box className="SpecialistCardImg">
                    <Link to={`/specialist/${specialist.id}`}>
                      <CardMedia
                        component="img"
                        image={`${apiProxy}${
                          loading ? "" : specialist.profile_picture
                        }`}
                        alt={loading ? "Loading" : specialist.full_name}
                        height="300px"
                        sx={{ objectFit: "cover" }}
                      />
                      <SearchIcon
                        className="searchIcon"
                        sx={{
                          fontSize: 50,
                          backgroundColor: "#D4D4D4",
                          borderRadius: "50px",
                          p: 1,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </Link>
                  </Box>
                )}

                <CardContent sx={{ p: 1, mt: 1 }}>
                  {loading ? (
                    <React.Fragment>
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="text" width="100%" height={50} />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography
                        gutterBottom
                        variant="body1"
                        component="div"
                        sx={{
                          fontSize: "17px",
                          color: "purple",
                          fontWeight: "600",
                          lineHeight: 1,
                        }}
                      >
                        {specialist.full_name}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body1"
                        component="div"
                        color="text.secondary"
                        sx={{ fontSize: "14px" }}
                      >
                        {specialist.description.slice(0, 80)}
                      </Typography>
                    </React.Fragment>
                  )}

                  {loading ? (
                    <Typography
                      sx={{
                        minWidth: { lg: 250, md: 250 },
                      }}
                      className="ServiceCardSkeleton"
                    >
                      <Skeleton variant="text" width="50%" height={20} />
                    </Typography>
                  ) : (
                    <Typography
                      color="error"
                      fontSize="12px"
                      fontWeight="600"
                      mt={1}
                    >
                      Ksh {specialist.pricing}
                    </Typography>
                  )}

                  {loading ? (
                    <Typography
                      sx={{
                        minWidth: { lg: 250, md: 250 },
                      }}
                      className="ServiceCardSkeleton"
                    >
                      <Skeleton variant="text" width="50%" height={20} />
                    </Typography>
                  ) : (
                    <Link to={`/specialist/${specialist.id}`}>
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
                          More Details
                        </Typography>
                        <NavigateNextIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box mt={2} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {Array.from(
          { length: Math.ceil(specialists.length / itemsPerPage) },
          (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              variant={currentPage === index + 1 ? "contained" : "outlined"}
              color="primary"
            >
              {index + 1}
            </Button>
          )
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
    </section>
  );
};

export default Services;
