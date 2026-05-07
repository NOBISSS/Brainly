import { Toaster } from "react-hot-toast";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { VerifyOTP } from "./pages/VerifyOTP";
import { ThemeProvider } from "./context/ThemeContext";

import DashboardV2 from "./pages/DashboardV2";
import AdminDashboard from "./pages/AdminDashboard";
import { lazy, Suspense } from "react";
import HomePage from "./components/home/HomePage";
import { ForgotPasswordForm } from "./components/ForgotPassword";

const SpeedInsights = lazy(() =>
  import("@vercel/speed-insights/react").then(m => ({ default: m.SpeedInsights }))
);


function App() {
  return <ThemeProvider><BrowserRouter>
  <Suspense>
    <SpeedInsights/>
  </Suspense>
    <Routes>
      <Route path="/home" element={<HomePage/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/verify-otp" element={<VerifyOTP/>} />
      {/*Forgot Password Under Testing */}
      <Route path="/forgotpassword" element={<ForgotPasswordForm/>} />
      
      <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Navigate to="/dashboard" replace/>} /> 
        <Route path="/admin/dashboard" element={<AdminDashboard/>} /> 
        <Route path="/dashboard" element={<DashboardV2/>} /> 
        
     </Route>
     {/*FALLBACK*/}
     <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
    </Routes>
    <Toaster position="top-right"/>
  </BrowserRouter>
  </ThemeProvider>
}

export default App
