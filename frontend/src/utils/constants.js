
import Home from '../componets/Home'
import Navbar from '../componets/Navbar'
import Header from '../componets/Header'
import About from '../componets/About'
import Categories from '../componets/Categories'
import Services from '../componets/Services'
import Blogs from '../componets/Blogs'
import Reviews from '../componets/Reviews';
import Footer from '../componets/Footer'

// Patients dashboard

import Feeds from '../componets/PatientsDashboard/Feeds'
import Siderbar from '../componets/PatientsDashboard/Siderbar'

// Specialists dashboard
import SFeeds from '../componets/SpecialistsDashboard.js/SFeeds'


import HeaderImage1 from '../assets/imgs/HeaderImage1.png'
import HeaderImage2 from '../assets/imgs/HeaderImage2.png'
import HeaderImage3 from '../assets/imgs/HeaderImage3.png'
import blogsbg from '../assets/imgs/blogsbg.png'

import  Commitment from '../assets/icons/Commitment.png'
import  impact from '../assets/icons/impact.png'
import  Philosophy from '../assets/icons/philosophy.png'
import vision from '../assets/icons/vision.png'
import avatar from '../assets/icons/avatar.png'
import fbIcon from '../assets/icons/fbIcon.png'
import patientrecover from '../assets/icons/patientrecover.png'
import trophy from '../assets/icons/trophy.png'
import certs from '../assets/icons/certs.png'
import experience from '../assets/icons/experience.png'
import logo from '../assets/imgs/logo.png'
import footerGd from '../assets/imgs/footerGd.jpg'
import AboutImage from '../assets/imgs/AboutImage.jpg'


export {
    Home,
    Navbar,
    Header,
    About,
    Categories,
    Services,
    Blogs,
    Reviews,
    Footer,

    Feeds,
    Siderbar,

    SFeeds,
    

}

export {
    HeaderImage1, HeaderImage2, HeaderImage3, avatar, fbIcon, logo, footerGd, AboutImage, blogsbg
}

export {
    Commitment,
    impact,
    Philosophy,
    vision
}

export const statistics = [
    {
      id: 1,
      name: 'Patient recovery success',
      total: '3500+',
      description: 'Efficiently enable enabled sources and cost-effective products',
      icon: patientrecover
    },
    {
      id: 2,
      name: 'Certifications earned',
      total: '120+',
      description: 'Professionally cultivate one-to-one customer service with robust ideas.',
      icon: certs
    },
    {
      id: 3,
      name: 'Years of experience',
      total: '25+',
      description: 'Dynamically innovate resource-leveling customer service for state of the art customer service.',
      icon: experience
    },
{
    id: 4,
    name: 'Awards',
    total: '7+',
    description: 'Recognitions and honors received for excellence in healthcare services.',
    icon: trophy
}
  ];
  


//Company logos
export const companyLogos = [logo, logo, logo, logo, logo, logo, logo];
  

// API 
export const apiProxy = 'http://127.0.0.1:8000'
