import SpecialistStatisticsForm from "./SpecialistStatisticsForm"
import Appointments from "./Appointments"
import Profile from "./Profile"




const Content = ({selectedItem, token, specialistData, setSpecialist, feedbacks, setAppointments, appointments}) => {
  return (
    <div>
      {selectedItem === "Statistics" && (
    <SpecialistStatisticsForm token={token} specialistData={specialistData} setSpecialist={setSpecialist} feedbacks={feedbacks} appointments={appointments}/>
    )}

      {selectedItem === "Profile" && (
      <Profile token={token} specialistData={specialistData} setSpecialist={setSpecialist} appointments={appointments}/>
      )}

      {selectedItem === "Appointments" && (
      <Appointments token={token} feedbacks={feedbacks}
      setAppointments={setAppointments} appointments={appointments}
      />
      )}


    </div>
  )
}

export default Content

