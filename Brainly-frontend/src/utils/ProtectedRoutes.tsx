import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export  function ProtectedRoutes(){
    const [status,setStatus]=useState<"Loading" | "Authorized" | "Unauthrorized">();
    //check user wheather it is exists or not
    useEffect(()=>{
        const VerifyUser=async()=>{
    const token=localStorage.getItem("token");
    try{
    await axios.get(BACKEND_URL+"api/v1/users/profile",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    setStatus("Authorized");
    }catch(err:any){
        console.error("Auth Verify Failed:",err?.response || err);

        if(err.response?.status===401){
            setStatus("Unauthrorized");
        }else{
            setStatus("Unauthrorized");
        }
    }
};
        VerifyUser();
    },[])

    //checking authentication
    if(status==="Loading"){
        return(
            <div className='min-h-screen flex items-center justify-center text-gray-500'>
                Checking Authentication
            </div>
        );
    }

    //if not authorized
    if(status==="Unauthrorized"){
        return <Navigate to="/signin" replace/>
    }

    //if authorized
     return <Outlet/>
}
