import { lazy, Suspense } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";

import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";

import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./pages/VerifyOTP";
import DashboardV2 from "./pages/DashboardV2";
import AdminDashboard from "./pages/AdminDashboard";

import HomePage from "./components/home/HomePage";
import { ForgotPasswordForm } from "./components/ForgotPassword";

const SpeedInsights = lazy(() =>
    import("@vercel/speed-insights/react").then(
        (module) => ({
            default: module.SpeedInsights,
        })
    )
);

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Suspense fallback={null}>
                    <SpeedInsights />
                </Suspense>

                <Routes>
                    <Route
                        path="/home"
                        element={<HomePage />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/signin"
                        element={<Signin />}
                    />

                    <Route
                        path="/verify-otp"
                        element={<VerifyOTP />}
                    />

                    <Route
                        path="/forgotpassword"
                        element={<ForgotPasswordForm />}
                    />

                    <Route element={<ProtectedRoutes />}>
                        <Route
                            path="/"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={<DashboardV2 />}
                        />

                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />
                    </Route>

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />
                </Routes>

                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                    }}
                />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;