import { Stack } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
// import HealingIcon from '@mui/icons-material/Healing';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';



const Siderbar = ({selectedItem, setSelectedItem}) => {
  const items = [
   
    { name: 'Profile', icon: <PersonIcon /> },
    { name: 'Appointments', icon: <EventIcon /> },
    { name: 'Health Info', icon: <FavoriteIcon /> },
    { name: 'Chat', icon: <ChatBubbleOutlineIcon /> },
    // { name: 'Sx Checker', icon: <HealingIcon /> },
    { name: 'Exercises', icon: <FitnessCenterIcon /> },
    { name: 'Diets', icon: <RestaurantMenuIcon /> },
   
   
    
  ]

  return (
    <Stack direction="row"
    sx={{overflowY: "auto", height: {xm: "auto", md: "95%"},
flexDirection: {md: "column"}}}
    > 
     {items.map((item) => (
      <button className='category-btn' onClick={() => setSelectedItem(item.name)} key={item.name}
      style={{
        background: item.name === selectedItem && "red",
        opacity: item.name === selectedItem && 1   
      

    }} >
        <span style={{color: item.name === selectedItem? "white" : "#020035"}} 

         
> {item.icon}</span>  <span style={{marginLeft: "20px"}}>  {item.name}</span> 

    

      </button>
   
     ))}
   
      
    </Stack>
  )
}

export default Siderbar
