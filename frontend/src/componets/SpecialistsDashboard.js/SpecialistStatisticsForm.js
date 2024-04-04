import React from "react";
import SpecialistStatistics from "./SpecialistStatistics";

const SpecialistStatisticsForm = ({ appointments, feedbacks }) => {
  // Data patients feedback
  const patients_feedbacks = appointments.map((appointment) => {
    const { patientDetails } = appointment;
    const matchingFeedback = feedbacks.find(
      (feedback) => feedback.patient === patientDetails.id
    );
    return {
      ...patientDetails,
      rating: matchingFeedback ? matchingFeedback.rating : null,
      feedback_text: matchingFeedback ? matchingFeedback.feedback_text : null,
      timestamp: matchingFeedback
        ? new Date(matchingFeedback.timestamp).toLocaleString()
        : null,
    };
  });

  const now = new Date();

  // Upcoming Appointments
  const upcoming_appointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return appointmentDate > now; // Filter appointments in the future
    })
    .map((appointment) => ({
      id: appointment.patientDetails.id,
      name: appointment.patientDetails.full_name,
      description: appointment.description,
      timestamp: new Date(appointment.date_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      profile_picture: appointment.patientDetails.profile_picture,
      countdownTimer: appointment.countdownTimer,
      appointmentDate: new Date(appointment.date_time),
      status: appointment.status,
    }))
    .sort((a, b) => a.appointmentDate - b.appointmentDate);

  // Data for appointment analytics
  const appointmentCountByDay = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
  };

  appointments.forEach((appointment) => {
    const day = new Date(appointment.updated_at).toLocaleString("en-US", {
      weekday: "short",
    });
    appointmentCountByDay[day] += 1;
  });

  const appointmentData = Object.entries(appointmentCountByDay).map(
    ([day, count]) => ({
      name: day,
      value: count,
    })
  );

  // Filter appointments by gender and age
  const gender_data = [
    {
      name: "women",
      total: appointments.filter(
        (appointment) => appointment.patientDetails.gender === "Female"
      ).length,
    },
    {
      name: "men",
      total: appointments.filter(
        (appointment) => appointment.patientDetails.gender === "Male"
      ).length,
    },
    {
      name: "children",
      total: appointments.filter((appointment) => {
        const age =
          new Date().getFullYear() -
          new Date(appointment.patientDetails.date_of_birth).getFullYear();
        return age < 18;
      }).length,
    },
  ];

  // Function to calculate the average rating
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return sum / ratings.length;
  };

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

  // Calculate Overall Performance
  const overallPerformanceData = [
    {
      name: "Satisfaction",
      value: calculateAverageRating(
        feedbacks.map((feedback) => feedback.rating)
      ),
    },
    {
      name: "Efficiency",
      value: calculateAverageRating(
        feedbacks.map((feedback) => feedback.rating + 2)
      ),
    },
    {
      name: "Efficiency",
      value: calculateAverageRating(
        feedbacks.map((feedback) => feedback.rating * 2)
      ),
    },
    {
      name: "Timeliness",
      value: calculateAverageRating(
        feedbacks.map((feedback) => feedback.rating - 2)
      ),
    },
  ];

  console.log("upcoming appointments", upcoming_appointments);

  return (
    <div>
      <SpecialistStatistics
        patientRateData={patientRateData}
        overallPerformanceData={overallPerformanceData}
        appointmentData={appointmentData}
        patients_feedbacks={patients_feedbacks}
        gender_data={gender_data}
        appointments={appointments}
        upcoming_appointments={upcoming_appointments}
        feedbacks={feedbacks}
      />

      {/* <Profile upcoming_appointments={upcoming_appointments}/> */}
    </div>
  );
};

export default SpecialistStatisticsForm;
