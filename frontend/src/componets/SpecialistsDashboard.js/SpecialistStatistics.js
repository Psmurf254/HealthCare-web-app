import {
  Card,
  Box,
  CardContent,
  Grid,
  Stack,
  Typography,
  CardMedia,
  Avatar,
  LinearProgress,
} from "@mui/material";
import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SpecialistStatistics = ({
  gender_data,
  patients_feedbacks,
  upcoming_appointments,
  appointmentData,
  patientRateData,
  overallPerformanceData,
}) => {
  const totalCount = gender_data.reduce((acc, curr) => acc + curr.total, 0);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <>
      <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="start">
        <Box sx={{ width: { lg: "40%" } }} height={380} objectFit="cover">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ textAlign: "left", p: 2 }}>
                <Typography
                  color="purple"
                  fontSize="12px"
                  lineHeight={1.5}
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Gender Statistics
                </Typography>
                <ResponsiveContainer width="100%" height={318}>
                  <PieChart>
                    <Pie
                      data={gender_data}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                    >
                      {gender_data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack gap={2}>
                {gender_data.map((item, index) => (
                  <Card
                    key={index}
                    sx={{
                      cursor: "pointer",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <CardContent>
                      <Typography
                        component="div"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {item.name}
                      </Typography>
                      <Box
                        display="flex"
                        gap={1}
                        mt={1}
                        justifyContent="center"
                      >
                        <Typography variant="h4" fontWeight={600}>
                          {item.total}
                        </Typography>
                        <Typography color="green" fontSize="15px">
                          {((item.total / totalCount) * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* container  3  */}

        <Box
          sx={{
            width: { lg: "50%" },
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          p={2}
          objectFit="cover"
          display="flex"
          gap={2}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{ overflowY: "auto", height: 380 }}>
              <Typography
                lineHeight={1.5}
                color="purple"
                fontSize="12px"
                textTransform="uppercase"
                fontWeight={600}
              >
                Patients Feedbacks
              </Typography>
              {patients_feedbacks.slice(0, 4).map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 3, p: 2, mt: 2 }}>
                  <CardMedia>
                    <Avatar
                      alt="User Avatar"
                      src={item.profile_picture}
                      sx={{ width: 35, height: 35 }}
                    />
                  </CardMedia>
                  <Box>
                    <Typography variant="body6" color="purple">
                      {item.name}
                    </Typography>
                    <Typography fontSize="14px" color="gray" opacity={0.8}>
                      {item.feedback_text.slice(0, 25)}
                    </Typography>
                    <Typography fontSize="12px" color="green" opacity={0.8}>
                      {item.full_name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6} sx={{ overflowY: "auto", height: 380 }}>
              <Box>
                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Upcoming appointments
                </Typography>
                {upcoming_appointments.map(
                  (item, index) =>
                    item.status === "approved" && (
                      <Accordion defaultExpanded key={index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel3-content"
                          id="panel3-header"
                        >
                          <CardMedia sx={{ display: "inline-flex", gap: 1 }}>
                            <Avatar
                              alt="User Avatar"
                              src={item.profile_picture}
                              sx={{ width: 35, height: 35 }}
                            />
                            <Typography
                              fontSize="12px"
                              color="gray"
                              opacity={0.8}
                            >
                              {item.countdownTimer.days > 0 &&
                                `${item.countdownTimer.days}d `}
                              {item.countdownTimer.hours > 0 &&
                                `${item.countdownTimer.hours}h `}
                              {item.countdownTimer.minutes > 0 &&
                                `${item.countdownTimer.minutes}m `}
                              {item.countdownTimer.seconds}s
                              <LinearProgress
                                variant="determinate"
                                value={calculateProgress(item.countdownTimer)}
                              />
                            </Typography>
                          </CardMedia>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box width="100%">
                            <Typography
                              fontSize="12px"
                              color="text.secondary"
                              opacity={0.8}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>

      {/* section 2 */}
      <Stack mt={3} spacing={2} maxWidth="90%">
        <Grid container spacing={1}>
          {/* Appointment Analytics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Appointment Analytics
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={appointmentData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Patient Rate Score */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Patient Rate Score
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
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
              </CardContent>
            </Card>
          </Grid>
          {/* Overall Performance */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  fontSize="12px"
                  lineHeight={1.5}
                  mb={2}
                  color="purple"
                  textTransform="uppercase"
                  fontWeight={600}
                >
                  Overall Performance
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={overallPerformanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" barSize={5} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

const calculateProgress = (countdownTimer) => {
  const totalSeconds =
    countdownTimer.days * 24 * 60 * 60 +
    countdownTimer.hours * 60 * 60 +
    countdownTimer.minutes * 60 +
    countdownTimer.seconds;
  const totalTime = 24 * 60 * 60;
  return ((totalTime - totalSeconds) / totalTime) * 100;
};

export default SpecialistStatistics;
