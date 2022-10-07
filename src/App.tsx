import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './templates/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import RequireAuth from './molecules/RequireAuth';
import Profil from './pages/User/Profil';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public route */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App;
