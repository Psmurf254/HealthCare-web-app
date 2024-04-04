import { Stack } from '@mui/material'
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Sidebar = ({selectedItem, setSelectedItem}) => {
    const items = [
        { name: 'Profile', icon: <PersonIcon /> },
        {name: 'Statistics', icon: <BookOnlineIcon/>},
        { name: 'Appointments', icon: <EventIcon /> },
       
      ]
      return (
        <Stack direction="row"  px={3}
        sx={{
          background: 'linear-gradient(to bottom, rgba(128, 128, 128, 0.5), rgba(221, 221, 221, 0.1))',
          overflowY: "auto", height: {xm: "auto", md: "95%"},
    flexDirection: {md: "column"}}}
        > 
         {items.map((item) => (
          <button className='category-btn' onClick={() => setSelectedItem(item.name)} key={item.name}
          style={{
            background: item.name === selectedItem && "red",
            opacity: item.name === selectedItem && 1, 
            position: 'relative',
            
           
          
    
        }} >
            <span style={{ color: item.name === selectedItem? "white" : "#020035"}
          
          } 
    
             
    > {item.name}</span>  <span style={{position: 'absolute', right: 0}}>  <NavigateNextIcon/></span> 
    
        
    
          </button>
       
         ))}
       
          
        </Stack>
      )
}

export default Sidebar
