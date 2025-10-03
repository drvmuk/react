import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/LoginPage";
import Landing from "./pages/LandingPage";
import Agentic from "./pages/AgenticIngestion";
import CodePage from './pages/CodePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Landing" element={<Layout><Landing /></Layout>} />
        <Route path="/Agentic" element={<Layout><Agentic /></Layout>} />
        <Route path="/Code" element={<Layout><CodePage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

