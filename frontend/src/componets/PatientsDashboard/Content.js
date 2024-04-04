import Appointments from "./Appointments";
import DietFeed from "./Diet/DietFeed";
import ExerciseFeed from "./Exercises/ExerciseFeed";
import HealthInfo from "./HealthInfo";
import Profile from "./Profile";
import ChatInterface from "./ChatInterface";
import SymptomsChecker from "./SymptomsChecker";

const Content = ({
  selectedItem,
  patientData,
  setPatient,
  token,
  appointmentsData,
  setAppointments,
}) => {
  return (
    <div>
      {selectedItem === "Profile" && (
        <Profile
          patientData={patientData}
          token={token}
          setPatient={setPatient}
          appointments={appointmentsData}
        />
      )}

      {selectedItem === "Appointments" && (
        <Appointments
          token={token}
          setAppointments={setAppointments}
          appointments={appointmentsData}
        />
      )}

      {selectedItem === "Health Info" && (
        <HealthInfo patientData={patientData} />
      )}

      {selectedItem === "Exercises" && <ExerciseFeed />}

      {selectedItem === "Diets" && <DietFeed />}

      {selectedItem === "Sx Checker" && <SymptomsChecker />}

      {selectedItem === "Chat" && <ChatInterface patientData={patientData} />}
    
    </div>
  );
};

export default Content;
