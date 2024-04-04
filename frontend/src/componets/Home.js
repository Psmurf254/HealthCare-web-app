import { About, Header, Categories, Services, Blogs, Reviews } from "../utils/constants";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { apiProxy } from "../utils/constants";
import CompanyLogos from "./CompanyLogos";
import Statistics from "./Statistics";



const Home = ({ token }) => {
  const [selectedCategory, setSelectedCategory] = useState('Primary Care');
  const [specialistCategories, setSpecialistCategories] = useState([]);
  const [allSpecialists, setAllSpecialists] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [abouts, setAbouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch abouts
        const responseAbout = await fetch(`${apiProxy}/api/about/`);
        const dataAbout = await responseAbout.json();
        setAbouts(dataAbout);

        // Fetch categories
        const responseCategories = await fetch(`${apiProxy}/api/categories/`);
        const dataCategories = await responseCategories.json();
        setSpecialistCategories(dataCategories);

        // Fetch all specialists
        const responseSpecialists = await fetch(`${apiProxy}/api/specialists/`);
        const dataSpecialists = await responseSpecialists.json();
        setAllSpecialists(dataSpecialists);

        // Filter specialists based on the initially selected category
        const filteredSpecialists = dataSpecialists.filter(
          (specialist) => specialist.category === dataCategories[0].id
        );
        setSpecialists(filteredSpecialists);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);

    
    const filteredSpecialists = allSpecialists.filter(
      (specialist) => specialist.category === categoryId
    );
    setSpecialists(filteredSpecialists);
  };

  

  return (
    <div style={{overflowX:'hidden' }}>
      <Header />
      <Box>
        {abouts.map((about, index) => (
          <Box key={index}><About about={about} /></Box>
        ))}
      </Box>
      <Categories
        categories={specialistCategories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
      <Services specialists={specialists} token={token} loading={loading}error={error}/>
      {/* <Blogs /> */}
      <Reviews token={token} />
    
      <Statistics/>

      <div style={{display: 'block'}} className="companylogos">
      <CompanyLogos/>
      </div>
     
    </div>
  );
};

export default Home;
