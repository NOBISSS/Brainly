import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Button } from "../components/Button";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import toast from "react-hot-toast";

export function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const {name,email,password,gender}=useSelector((state:RootState)=>state.user.user);
  // refs for each OTP box
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // allow only one digit or empty

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // go back to previous if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }
    setOtp(newOtp);

    // focus last filled
    const lastIndex = Math.min(pasteData.length - 1, 5);
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(name,email,password,gender,otp);
      const res = await axios.post(BACKEND_URL + "api/v1/users/register", {
        name,
        email,
        password,
        gender,
        otp: code,
      });
      //console.log("OTP VERIFY RESPONSE:: ", res.data);
      // on success -> redirect to dashboard or signin
      toast.success("Signup Verified Successfully");
      navigate("/dashboard"); // or "/signin" depending on your flow
    } catch (err: any) {
      console.error("OTP VERIFY ERROR:: ", err?.response || err);
      setError(
        err?.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-linear-to-b from-purple-200 to-white flex justify-center items-center">
      <div className="bg-white rounded border min-w-72 p-8 flex flex-col justify-center items-center shadow-md">
        <h1 className="text-3xl flex justify-center items-center p-2 text-purple-600 font-bold">
          Verify OTP
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center px-4">
          We&apos;ve sent a 6-digit verification code to your email. 
          Enter it below to continue.
        </p>

        {/* OTP boxes */}
        <div className="flex gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-12 border border-purple-300 rounded-md text-center text-xl font-semibold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-3 text-center px-2">
            {error}
          </p>
        )}

        <div className="w-full mt-2">
          <Button
            onClick={handleVerify}
            loading={loading}
            variant="Primary"
            text="Verify OTP"
            fullWidth={true}
          />
        </div>

        <div className="mt-4 text-xs text-gray-600">
          Didn&apos;t receive the code?{" "}
          <span className="text-purple-700 font-semibold cursor-pointer">
            Resend OTP
          </span>
          {/* hook this span to a resend API later */}
        </div>
      </div>
    </div>
  );
}
