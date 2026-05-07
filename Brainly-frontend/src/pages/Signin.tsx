import axios from "axios";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { ThemeToggle } from "../components/ThemeToggle";

export function Signin() {
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    const loginWithGoogle = () => {
        window.location.href = 'http://localhost:3000/api/v1/users/auth/google';
    };

    async function signin() {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        if (!email || !password) {
            toast.error("Email and Password are required");
            return;
        }
        try {
            await axios.post(BACKEND_URL + "api/v1/users/login", {
                email,
                password
            }, { withCredentials: true })

            //redirect the user to dashboard
            navigate("/dashboard")
        } catch (error) {
            console.log("ERROR:", error);
            toast.error(error?.response?.data?.message);
        }
    }
    return <div className="h-screen w-screen bg-linear-to-b from-purple-200 to-white bg-gray-200 flex justify-center items-center">
        <div className="bg-gradient-to-b from-black via-75% to-transparent  rounded-2xl  p-4">
            <div className="bg-gray-100 rounded-3xl min-w-48 p-8 flex flex-col justify-center items-center">
                <h1 className="text-3xl flex justify-center items-center p-4 text-purple-600 font-bold">Login</h1>
                <Input type="text" reference={emailRef} placeholder="Email" />
                <Input type="password" reference={passwordRef} placeholder="Password" />
                <div className="flex justify-center items-center self-center pt-4">
                    <Button onClick={signin} loading={false} variant="Primary" text="Signin" fullWidth={true} />
                </div>
                <div>
                    <button className="px-3 mt-5 py-2 bg-black text-white" onClick={loginWithGoogle}>Login With Google</button>
                </div>
                <div className="mt-5 flex flex-col justify-center ">
                    <h1><span className="text-purple-700 underline cursor-pointer" onClick={() => navigate("/forgotpassword")}>Forgot Password ?</span></h1>
                    <h1 className="text-gray-700">New User ?{" "} <span className="text-purple-700 underline cursor-pointer" onClick={() => navigate("/signup")}>Register</span></h1>
                </div>
            </div>
        </div>
    </div>
}