import React, { useState } from 'react'; import { Link as RouterLink } from 'react-router-dom'; import Drawer from '@mui/material/Drawer'; import List from '@mui/material/List'; import ListItem from '@mui/material/ListItem'; import ListItemIcon from '@mui/material/ListItemIcon'; import ListItemText from '@mui/material/ListItemText'; import IconButton from '@mui/material/IconButton'; import HomeIcon from '@mui/icons-material/Home'; import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import FolderIcon from '@mui/icons-material/Folder';
import '../assets/css/Sidebar.css';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 57,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 57,
          height: '100vh', // Ensure full vertical height
          transition: 'width 300ms ease',
          overflowX: 'hidden',
          position: 'relative',
        },
      }}
    >
      <List>
        {[{ text: 'Home', icon: <HomeIcon />, link: '/' },
        { text: 'Truck Operations', icon: <LocalShippingIcon />, link: '/truck-operations' },
        { text: 'Vendor Check In/Out', icon: <CheckCircleOutlineIcon />, link: '/vendor-check-in-out' },
        { text: 'Combine CSV Data', icon: <FolderIcon />, link: '/combine-csv' }
        ].map((item, index) => (
          <ListItem button key={item.text} component={RouterLink} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} style={{ display: open ? 'block' : 'none' }} />
          </ListItem>
        ))}
      </List>
      <IconButton
        onClick={handleDrawerToggle}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '0',
          transform: 'translateY(-50%) translateX(30%)', // Adjusted to prevent overlap
          zIndex: 1300,
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Drawer>
  );
};

export default Sidebar;
