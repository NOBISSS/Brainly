import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setUserDetails } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

export function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  async function sendOtp() {
    const username = usernameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }


    // NOTE: if your slice expects { name, email, password } change this accordingly
    dispatch(setUserDetails({ name, email }));

    try {
      const resp = await axios.post(
        BACKEND_URL + "api/v1/users/sendotp",
        { email }
      );

      if (resp.data.success) {
        toast.success("OTP sent successfully");
        navigate("/verify-otp");
      } else {
        toast.error("Please enter a valid email");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed while sending OTP"
      );
    }
  }
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-purple-200 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-50 rounded-3xl shadow-md p-4 sm:p-6">
          <div className="bg-gray-100 rounded-2xl px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-t from-fuchsia-500 to-purple-900 bg-clip-text text-transparent text-center">
              Signup
            </h1>

            <div className="w-full space-y-3">
              <Input type="text" reference={usernameRef} placeholder="Username" />
              <Input type="text" reference={emailRef} placeholder="Email" />
              <Input
                type="password"
                reference={passwordRef}
                placeholder="Password"
              />
            </div>

            <div className="w-full flex justify-center pt-4">
              <Button
                onClick={sendOtp}
                loading={false}
                variant="Primary"
                text="Signup"
                fullWidth={true}
              />
            </div>

            <div className="mt-4 text-sm text-center">
              Already a user?{" "}
              <span
                className="text-purple-600 cursor-pointer underline"
                onClick={() => navigate("/signin")}
              >
                Login
              </span>
            </div>

            {/* Optional: secondary action if you still want direct signup */}
            {/* <button
              className="mt-3 text-xs text-gray-500 hover:underline"
              onClick={signup}
            >
              Debug: Signup without OTP
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
