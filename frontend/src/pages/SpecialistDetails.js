import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { apiProxy } from "../utils/constants";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Rating,
  Stack,
  CardMedia,
  IconButton,
  Grid,
} from "@mui/material";
import Loader from "../utils/Loader";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import { WhatsApp, Twitter, Facebook, Instagram } from "@mui/icons-material";
import { HeaderImage3 } from "../utils/constants";
import VerifiedIcon from "@mui/icons-material/Verified";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { testimonialsettings } from "../utils/SlickSettings";
import GradeIcon from "@mui/icons-material/Grade";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from "recharts";

const SpecialistDetails = () => {
  const { id } = useParams();
  const [specialistDetails, setSpecialistDetails] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);
  const [relatedSpecialists, setRelatedSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const specialistDetailsRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState("Achievements");

  useEffect(() => {
    const fetchSpecialistDetails = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/specialists/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const specialistData = await response.json();
        setSpecialistDetails(specialistData);

        const feedbackresponse = await fetch(
          `${apiProxy}/api/specialist_feedback`
        );
        const feedbackData = await feedbackresponse.json();

        // Filter feedbacks for the current specialist
        const specialistFeedbacks = feedbackData.filter(
          (feedback) => feedback.specialist === specialistData.id
        );

        // Fetch patient data
        const patientIds = specialistFeedbacks.map(
          (feedback) => feedback.patient
        );
        const patientresponse = await fetch(
          `${apiProxy}/api/all_patients/?id=${patientIds.join(",")}`
        );
        const patientData = await patientresponse.json();

        // Merge feedbacks with patient data
        const mergedFeedbacks = specialistFeedbacks.map((feedback) => {
          const patient = patientData.find(
            (patient) => patient.id === feedback.patient
          );
          return { ...feedback, patient };
        });

        setFeedbacks(mergedFeedbacks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching specialist details:", error.message);
        setLoading(false);
      }
    };

    fetchSpecialistDetails();
  }, [id]);

  useEffect(() => {
    const fetchRelatedSpecialists = async () => {
      // Fetch specialists with the same category as the current specialist
      if (specialistDetails) {
        try {
          const response = await fetch(
            `${apiProxy}/api/specialists?category=${specialistDetails.category}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setRelatedSpecialists(
            data.filter((specialist) => specialist.id !== specialistDetails.id)
          );
        } catch (error) {
          console.error("Error fetching related specialists:", error.message);
        }
      }
    };

    fetchRelatedSpecialists();
  }, [specialistDetails]);

  const stackStyle = {
    backgroundImage: `linear-gradient(rgba(4,9,30,0.2), rgba(4,9,30,0.2)), url(${HeaderImage3})`,
  };

  const scrollToFashionDetail = () => {
    specialistDetailsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate Patient Rate Score
  const patientRateData = [
    {
      name: "High",
      value: feedbacks.filter((feedback) => feedback.rating >= 4).length,
    },
    {
      name: "Medium",
      value: feedbacks.filter((feedback) => feedback.rating === 3).length,
    },
    {
      name: "Low",
      value: feedbacks.filter((feedback) => feedback.rating <= 2).length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <section style={{ padding: "0", marginTop: 0 }} ref={specialistDetailsRef}>
      <Stack>
        <Stack className="bg" style={stackStyle}>
          <Stack sx={{ p: { xs: "20px", md: "50px" } }}>
            {loading ? (
              <Loader />
            ) : (
              <Stack sx={{ zIndex: 99 }}>
                <Typography
                  className="mainheading"
                  sx={{
                    fontSize: {
                      lg: "20px",
                      md: "18px",
                      sm: "17px",
                      xs: "17px",
                    },
                    fontWeight: "500",
                    mb: "5x",
                    color: "#fff",
                  }}
                >
                  About<span></span>
                </Typography>
                <Box className="DocDetailContent" sx={{ mt: { lg: 1, md: 1 } }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      color: "#fff",
                    }}
                  >
                    {specialistDetails.full_name}
                  </Typography>
                  <Typography
                    mt={1}
                    lineHeight={1.5}
                    color="text.secondary"
                    variant="body1"
                    component="div"
                    sx={{
                      maxWidth: { lg: "50%", md: "50%", sm: "95%", xs: "95%" },
                    }}
                  >
                    {specialistDetails.description.slice(0, 300)}
                  </Typography>
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography color="#000" variant="h6" className="pricing">
                      Ksh {specialistDetails.pricing}
                    </Typography>
                    <Link to={`/appointments/book/${specialistDetails.id}`}>
                      <Button variant="contained" color="primary">
                        Make Appointment
                      </Button>
                    </Link>
                  </CardContent>
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mt: "5%",
            p: 3,
            gap: 5,
          }}
        >
          <Box
            sx={{
              flex: "1",
              maxWidth: { xs: "100%", md: "50%" },
              pr: { xs: 0, md: 2 },
            }}
          >
            {specialistDetails && specialistDetails.background && (
              <Box>
                <Typography
                  className="mainheading"
                  sx={{
                    fontSize: {
                      lg: "20px",
                      md: "18px",
                      sm: "17px",
                      xs: "17px",
                    },
                    fontWeight: "500",
                    mb: "2rem",
                    color: "#fff",
                  }}
                >
                  <span>Background</span>
                </Typography>

                <Typography
                  variant="body3"
                  color="text.secondary"
                  lineHeight={2}
                >
                  {specialistDetails.background}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{ maxWidth: { xs: "100%", md: "50%" }, pl: { xs: 0, md: 2 } }}
          >
            <CardMedia
              component="img"
              image={`${apiProxy}${
                loading ? "" : specialistDetails?.profile_picture
              }`}
              alt={loading ? "Loading" : specialistDetails?.full_name}
              height="300px"
              sx={{ objectFit: "cover", borderRadiusTop: "5px" }}
            />
            <Stack
              backgroundColor="#16c2d5"
              padding={2}
              sx={{
                minWidth: { lg: 450 },
                borderBottomRadius: "5px",
              }}
            >
              {/* Contact Information */}
              <Typography
                fontSize="12px"
                lineHeight={1.5}
                color="purple"
                textTransform="uppercase"
                fontWeight={600}
              >
                Working Hours
              </Typography>

              <Typography
                variant="body"
                lineHeight={1.5}
                color="text.secondary"
                mt={1}
              >
                {specialistDetails?.on_call_information}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box mt={2}>
                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Contacts
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  <IconButton sx={{ mr: 2 }}>
                    {" "}
                    <CallIcon sx={{ fontSize: "17px", color: "red" }} />{" "}
                  </IconButton>
                  {specialistDetails?.contact_phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <IconButton sx={{ mr: 2 }}>
                    {" "}
                    <ContactEmergencyIcon
                      sx={{ fontSize: "17px", color: "red" }}
                    />{" "}
                  </IconButton>
                  {specialistDetails?.emergency_contact_details}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  <IconButton sx={{ mr: 2 }}>
                    {" "}
                    <EmailIcon sx={{ fontSize: "17px", color: "red" }} />{" "}
                  </IconButton>
                  {specialistDetails?.contact_email}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box mt={1} display="flex" gap={3} justifyContent="start">
                  <IconButton>
                    {specialistDetails?.x} <Twitter />
                  </IconButton>
                  <IconButton>
                    {specialistDetails?.whatsApp} <WhatsApp />
                  </IconButton>
                  <IconButton>
                    {specialistDetails?.facebook} <Facebook />
                  </IconButton>
                  <IconButton>
                    {specialistDetails?.instagram} <Instagram />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Stack>
          </Box>
        </Stack>

        <Divider />

        {/* Achievments and statistics */}
        <section style={{ marginTop: 0 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Stack direction="row" gap={3} mb={2}>
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem("Achievements")}
                  style={{
                    borderBottom:
                      "Achievements" === selectedItem && "1px solid green",
                  }}
                >
                  Achievemts
                </Button>
                <Button
                  onClick={() => setSelectedItem("Certifications")}
                  variant="outline"
                  borderRadius={0}
                  style={{
                    borderBottom:
                      "Certifications" === selectedItem && "1px solid green",
                  }}
                >
                  Certifications
                </Button>

                <Button
                  onClick={() => setSelectedItem("Work Experience")}
                  variant="outline"
                  borderRadius={0}
                  style={{
                    borderBottom:
                      "Work Experience" === selectedItem && "1px solid green",
                  }}
                >
                  Work Experience
                </Button>
              </Stack>

              <Divider />

              {selectedItem === "Achievements" && (
                <>
                  {specialistDetails && specialistDetails.achievements && (
                    <Box mt="2rem">
                      <ul>
                        {specialistDetails.achievements
                          .split(",")
                          .map((achievement, index) => (
                            <li key={index}>
                              <Typography
                                lineHeight={2}
                                color="text.secondary"
                                variant="body1"
                              >
                                <GradeIcon
                                  style={{
                                    marginRight: "0.5rem",
                                    verticalAlign: "middle",
                                    color: "blue",
                                  }}
                                />
                                {achievement.trim()}
                              </Typography>
                            </li>
                          ))}
                      </ul>
                    </Box>
                  )}
                </>
              )}

              {selectedItem === "Certifications" && (
                <>
                  {specialistDetails &&
                    specialistDetails.medical_certifications && (
                      <Box mt={2}>
                        <ul>
                          {specialistDetails.medical_certifications
                            .split(",")
                            .map((certification, index) => (
                              <li key={index}>
                                <Typography
                                  lineHeight={2}
                                  color="text.secondary"
                                  variant="body1"
                                >
                                  <VerifiedIcon
                                    style={{
                                      marginRight: "0.5rem",
                                      verticalAlign: "middle",
                                      color: "blue",
                                    }}
                                  />
                                  {certification.trim()}
                                </Typography>
                              </li>
                            ))}
                        </ul>
                      </Box>
                    )}
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ borderLeft: 1, p: 2, pt: 0 }}>
                <Typography variant="h6">
                  {specialistDetails.full_name} Perfomance
                </Typography>

                <ResponsiveContainer
                  width="100%"
                  height={200}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PieChart>
                    <Pie
                      data={patientRateData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {patientRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <Divider sx={{ py: 2 }} />
              </Box>
            </Grid>
          </Grid>
        </section>

        {/* Reviews */}
        <Stack
          sx={{
            background:
              "linear-gradient(to bottom, rgba(128, 128, 128, 0.5), rgba(221, 221, 221, 0.1))",
            minHeight: "30vh",
            padding: 3,
            position: "relative",
          }}
        ></Stack>
        <section style={{ marginTop: "-15%" }}>
          {feedbacks && feedbacks.length > 0 && (
            <Box mt="2rem">
              <Typography
                className="mainheading"
                sx={{
                  fontSize: { lg: "20px", md: "18px", sm: "17px", xs: "17px" },
                  fontWeight: "500",
                  mb: "2rem",
                }}
              >
                Patient<span> Feedback</span>
              </Typography>
              <Slider
                {...testimonialsettings}
                style={{ textAlign: "left", marginTop: "60px" }}
              >
                {feedbacks.map((item, index) => (
                  <Box sx={{ maxWidth: 400 }} key={index}>
                    <CardMedia
                      sx={{
                        borderRadius: "0 0 50px 50px",
                        width: "25%",
                        ml: "150px",
                      }}
                    >
                      <Avatar
                        alt={item.patient.full_name}
                        src={item.patient.profile_picture}
                        sx={{ width: 85, height: 85 }}
                      />
                    </CardMedia>
                    <CardContent>
                      <FormatQuoteIcon
                        sx={{ color: "#008080", fontSize: 25 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.5}
                      >
                        {item.feedback_text}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        <Typography
                          variant="div"
                          fontSize="17px"
                          color="purple"
                          gutterBottom
                        >
                          <Box>
                            <Rating
                              name={`rating-${item.user}`}
                              value={item.rating}
                              precision={0.5}
                              readOnly
                              sx={{ fontSize: "17px" }}
                            />
                          </Box>
                          {item.patient.full_name}
                        </Typography>
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ mt: 1, fontSize: "10px", opacity: 0.8 }}
                      >
                        {new Date(item.timestamp).toLocaleString("en-KE", {
                          timeZone: "America/New_York",
                        })}
                      </Typography>
                    </CardContent>
                  </Box>
                ))}
              </Slider>
            </Box>
          )}
          <Divider sx={{ mt: 3 }} />
        </section>

        {/* related */}
        <section style={{ marginTop: "-5%" }}>
          <Typography
            className="mainheading"
            sx={{
              fontSize: { lg: "20px", md: "18px", sm: "17px", xm: "17px" },
              fontWeight: "500",
              mt: "70px",
              mb: "50px",
            }}
          >
            Similar <span>Services</span>
          </Typography>
          {/* Display related specialists */}
          {relatedSpecialists.length > 0 ? (
            <Stack
              sx={{
                flexDirection: {
                  lg: "row",
                  md: "row",
                  sm: "column",
                  xm: "column",
                },
                flexWrap: "wrap",
                padding: "20px",
              }}
              boxShadow="0 4px 8px rgba(0,0,0,0.1)"
              gap={5}
            >
              {relatedSpecialists.slice(0, 9).map((specialist) => (
                <Box
                  key={specialist.id}
                  sx={{
                    maxWidth: { lg: 250, md: 250 },
                  }}
                  className="ServiceCard"
                >
                  <Card>
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
                          onClick={scrollToFashionDetail}
                        />
                      </Link>
                    </Box>

                    <CardContent sx={{ p: 1, mt: 1 }}>
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

                      <Typography
                        sx={{
                          minWidth: { lg: 250, md: 250 },
                        }}
                        className="ServiceCardSkeleton"
                      ></Typography>

                      <Typography
                        color="error"
                        fontSize="12px"
                        fontWeight="600"
                        mt={1}
                      >
                        Ksh {specialist.pricing}
                      </Typography>

                      <Typography
                        sx={{
                          minWidth: { lg: 250, md: 250 },
                        }}
                        className="ServiceCardSkeleton"
                      ></Typography>

                      <Link to={`/specialist/${specialist.id}`}>
                        <IconButton
                          sx={{
                            mt: 1,
                            border: "2px solid green",
                            p: "3px 30px",
                            borderRadius: "5px",
                          }}
                          onClick={scrollToFashionDetail}
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
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="h6" color="error">
              No related specialists found.
            </Typography>
          )}
        </section>
      </Stack>
    </section>
  );
};

export default SpecialistDetails;
