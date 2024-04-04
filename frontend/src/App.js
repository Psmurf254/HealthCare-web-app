
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './componets/accounts/LoginForm';
import RegisterForm from './componets/accounts/RegisterForm';
import { Navbar, Home, Footer, Feeds, SFeeds } from './utils/constants';
import ExerciseDetail from './componets/PatientsDashboard/Exercises/ExerciseDetail';
import DietDetails from './componets/PatientsDashboard/Diet/DietDetails';
import SpecialistDetails from './pages/SpecialistDetails';
import AppointmentForm from './pages/AppointmentForm';
import CreatePatientAccount from './pages/CreatePatientAccount';
import CreateSpecialistAccount from './pages/CreateSpecialistAccount';
import VideoCall from './componets/SpecialistsDashboard.js/VideoCall';
import { apiProxy } from './utils/constants';


const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null);
  const navigate = useNavigate(); 
  const [isSpecialist, setIsSpecialist] = useState(true);
  const [isPatient, setIsPatient] = useState(true);
  const [patient, setPatient] = useState('');
  

  useEffect(() => {
    const fetchSpecialist = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/specialists/specialist/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
           setIsSpecialist(false)
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }


        }
      } catch (error) {
        console.error("Error fetching specialist data:", error);
      }
    };

    fetchSpecialist();
  }, [token, navigate]);


  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`${apiProxy}/api/patients/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });


        if (!response.ok) {
          if (response.status === 404) {
            setIsPatient(false)
          
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        const data = await response.json();
        setPatient(data);

      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [token, navigate]);
  
  
  

  const handleRegister = (access) => {
    setToken(access);
    localStorage.setItem('accessToken', access);
    navigate('/');
  };

  const handleLogin = (access) => {
    setToken(access);
    localStorage.setItem('accessToken', access);
    navigate('/');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    navigate('/login/');
  };



  return (
    <div>
      <Navbar token={token} onLogout={handleLogout} isPatient={isPatient} isSpecialist={isSpecialist} patientData={patient}/>

      <Routes>
        <Route path='/' element={<Home token={token}/>} />
        <Route path='/specialist_dashboard/' element={<SFeeds token={token} />} />
        <Route path='/register' element={<RegisterForm onRegister={handleRegister} />} />
        {token && <Route path="/exercise/:id" element= {<ExerciseDetail/>}/>}
        {token && <Route path="/recipe/:label" element= {<DietDetails/>}/>}
        {token && <Route path='/patient/account/create/' element={<CreatePatientAccount token={token}/>} />}
        {token && <Route path="/specialist/account/create/" element= {<CreateSpecialistAccount token={token}/>}/>}
        {token && <Route path='/patient_dashboard/' element={<Feeds token={token} />} />}
         <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/specialist/:id" element={<SpecialistDetails token={token} />} />
        <Route path="/appointments/book/:id" element={<AppointmentForm token={token} />} />
        

        <Route path='/specialist/meetings/:patientId' element={<VideoCall token={token} />}/>
      </Routes>
      <div style={{marginTop: '15%'}}>
      <Footer />
      </div>
    
    </div>
  );
};

export default App;
