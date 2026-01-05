import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { VerifyOTP } from "./pages/VerifyOTP";
function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/verify-otp" element={<VerifyOTP/>} />
      
      <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Navigate to="/dashboard" replace/>} /> 
        <Route path="/dashboard" element={<Dashboard/>} /> 
        
     </Route>
     {/*FALLBACK*/}
     <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
    </Routes>
    <Toaster position="top-right"/>
  </BrowserRouter>
}

export default App
