import axios from 'axios';
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export function ProtectedRoutes() {
    const [status, setStatus] = useState<"Loading" | "Authorized" | "Unauthorized">("Loading");
    //check user wheather it is exists or not
    useEffect(() => {
        const controller=new AbortController();
        const VerifyUser = async () => {
            try {
                await axios.get(BACKEND_URL + "api/v1/users/profile", {
                    withCredentials: true,
                    signal:controller.signal,
                });
                setStatus("Authorized");
            } catch (err: any) {
                console.error("Auth Verify Failed:", err?.response || err);
                if(err.name==="CanceledError"){
                    return;
                }

                if (err.response?.status === 401) {
                    setStatus("Unauthorized");
                } else {
                    setStatus("Unauthorized");
                }
            }
        };
        VerifyUser();
        return ()=>controller.abort();
    }, [])

    //checking authentication
    if (status === "Loading") {
        return (
            <div className='min-h-screen flex items-center justify-center text-gray-500'>
                Checking Authentication
            </div>
        );
    }

    //if not authorized
    if (status === "Unauthorized") {
        return <Navigate to="/home" replace />
    }

    //if authorized
    return <Outlet />
}
