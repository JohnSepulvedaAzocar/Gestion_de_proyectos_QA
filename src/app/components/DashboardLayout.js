'use client';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Button, Badge } from '@mui/material';
import { Home, Mail, Notifications, Settings, People, AccountCircle } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NoteIcon from '@mui/icons-material/Note';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../lib/firebase';
import DashboardUser from '../components/DashboardUser';
import DashboardQA from '../components/DashboardQA';
import ReportesReq from './ReportesReq';
import Users from './UserList';
import { useUserRole } from '../hooks/useUserRole';
import { collection, getDocs } from 'firebase/firestore';


export default function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const { role, loading, name } = useUserRole();

  useEffect(() => {

    async function getUnreadNotificationsByUser(userId) {
      const projectsRef = collection(firestore, "proyectos");

      const projectsSnapshot = await getDocs(projectsRef);

      let results = [];
    }
    getUnreadNotificationsByUser(name)
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/Login');
    } catch (err) {
      console.error("Error logging out: ", err);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setDrawerOpen(false);
  };

  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <DashboardUser />;
      case 'DashboardQA':
        return <DashboardQA />;
      case 'Users':
        return <Users />;
      case 'Reportes':
        return <ReportesReq />;
      default:
        const defaultUser = role === 'QA' ? <DashboardQA /> : <DashboardUser />;
        return defaultUser;
    }
  };

  const renderDrawerItems = () => {
    if (role === 'QA') {
      return [
        { text: 'DashboardQA', icon: <Home />, view: 'DashboardQA' },
      ];
    } else if (role === 'Jefe_Proyectos') {
      return [
        { text: 'Dashboard', icon: <Home />, view: 'Dashboard' },
        { text: 'Reportes', icon: <NoteIcon />, view: 'Reportes' },
        { text: 'Users', icon: <People />, view: 'Users' },
      ];
    } else {
      return [];
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {role === 'QA' ? 'QA Procesos' : 'Gestión de Proyectos'}
          </Typography>
          {name}
          {role === 'QA' ?
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            : null}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
          {auth && <AccountCircle />}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <IconButton onClick={toggleDrawer} sx={{ ml: 1 }}>
          <ChevronLeftIcon />
        </IconButton>
        <List style={{ paddingTop: '30px' }}>
          {renderDrawerItems().map((item, index) => (
            <ListItem button key={item.text} onClick={() => handleViewChange(item.view)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
