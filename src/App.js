import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

import Tasks from './components/pages/Tasks';
import Login from './components/pages/Login';
import AttendancePage from './components/pages/AttendancePage';
import Reports from './components/pages/Reports';
import InternPage from './components/pages/InternPage';
import InternTasksPage from './components/pages/InternsTasks';
import MentorDashboard from './components/pages/MentorDashboard';
import MentorTasks from './components/pages/MentorTasks';
import MentorCharts from './components/pages/MentorCharts';
import UpdatePassword from './components/pages/UpdatePass';
import AdminProfile from './components/pages/AdminProfile'
import SidebarLayout from './components/Layout/SidebarLayout';
import logo from './components/assets/images/logo.webp';
import './App.css';
import './media.css';
import MentorProfile from './components/pages/MentorProfile';

const AppContent = ({ isLoggedIn, role, handleLogin, handleLogout }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to /login if not logged in and trying to access a protected page
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      return <Navigate to="/login" />;
    }

    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
     
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (role === 'admin') {
    return (
      <>
        
         <SidebarLayout
          links={[
            { to: "/admin/attendance", label: "Attendance" },
            { to: "/admin/tasks", label: "Tasks" },
            { to: "/admin/reports", label: "Reports" },
            { to: "/admin/profile", label: "Profile" },
            { label: "Logout" }
          ]}
          onLogout={handleLogout}
        />

        {/* <nav className="navbar">
          <img src={logo} alt="Logo" className="logos" />
          <div className='nav-links'>
            <Link to="/admin/attendance" className="link">Attendance</Link>
            <Link to="/admin/tasks" className="link">Tasks</Link>
            <Link to="/admin/reports" className="link">Reports</Link>
            <Link to="/admin/profile" className="link">Profile</Link>
            <button onClick={handleLogout} className="link">Logout</button>
          </div>
        </nav> */}

        

        <Routes>
          <Route path="/admin/attendance" element={<AttendancePage />} />
          <Route path="/admin/tasks" element={<Tasks />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="*" element={<Navigate to="/admin/attendance" />} />
        </Routes>
      </>
    );
  }

  if (role === 'mentor') {
    return (
      <>
           <SidebarLayout
          links={[
            { to: "/mentor/dashboard", label: "Dashboard" },
            { to: "/mentor/tasks", label: "Tasks" },
            { to: "/mentor/charts", label: "Charts" },
            { to: "/mentor/profile", label: "Profile" },
            { label: "Logout" }
          ]}
          onLogout={handleLogout}
        />

        {/* <nav className="navbar">
          <img src={logo} alt="Logo" className="logos" />
          <div className="nav-links">
            <Link to="/mentor/dashboard" className="link">Dashboard</Link>
            <Link to="/mentor/tasks" className="link">Tasks</Link>
            <Link to="/mentor/charts" className="link">Charts</Link>
            <Link to="/mentor/profile" className="link">Profile</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav> */}
        <Routes>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/tasks" element={<MentorTasks />} />
          <Route path="/mentor/charts" element={<MentorCharts />} />
          <Route path="/mentor/profile" element={<MentorProfile />} />
          <Route path="*" element={<Navigate to="/mentor/dashboard" />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <SidebarLayout
        links={[
          { to: "/intern", label: "Attendance" },
          { to: "/intern/tasks", label: "My Tasks" },
          { to: "/update-password", label: "Profile" },
          { label: "Logout" }
        ]}
        onLogout={handleLogout}
      />

      {/* <nav className="navbar">
        <img src={logo} alt="Logo" className="logos" />
        <div className="nav-links">
          <Link to="/intern" className="link">Attendance</Link>
          <Link to="/intern/tasks" className="link">My Tasks</Link>
          <Link to="/update-password" className="link">Profile</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav> */}
      <Routes>
        <Route path="/intern" element={<InternPage />} />
        <Route path="/intern/tasks" element={<InternTasksPage />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<Navigate to="/intern" />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(auth === 'true');
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', role);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        role={role}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

export default App;
