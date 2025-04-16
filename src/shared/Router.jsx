import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../pages/Home";
import Nav from "../components/Nav";
import DigitalGuide from "../components/DigitalGuide";
import ChatCompanion from "../components/ChatCompanion";
import SafetyMonitor from "../components/SafetyMonitor";

function Router() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/digital-guide" element={<DigitalGuide />} />
        <Route path="/chat-companion" element={<ChatCompanion />} />
        <Route path="/safety-monitor" element={<SafetyMonitor />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
