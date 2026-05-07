import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { CloudBackground } from './cloud-background'
import { Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { api } from '@/api/axios'
import { useNavigate } from 'react-router-dom'

type Step = 'email' | 'otp' | 'password' | 'success'

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate=useNavigate();
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(async () => {
      if (email) {
        setStep('otp')
        await api.post("api/v1/users/sendotp",{ email,type:"forgot" });
      } else {
        setError('Please enter a valid email')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(async () => {
      if (otp.length === 6) {
        try{
        const res=await api.post("api/v1/users/verify-otp",{
          email,
          otp,
          type:"forgot"
        });
        localStorage.setItem("resetToken",res.data.resetToken);
        setStep('password');
      }catch(error){
        setError('Please enter a valid OTP')
        console.log("Error:"+error);
        return;
      }

      } else {
        setError('Please enter a valid OTP')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(async() => {
      if (password && password === confirmPassword && password.length >= 8) {
        try{
          await api.post("api/v1/users/reset-password",{
            email,
            newPassword:password,
            confirmPassword,
            resetToken:localStorage.getItem("resetToken")
          })
          setStep('success')
        }catch(error){
          console.log("Error:"+error);
        }
      } else if (password !== confirmPassword) {
        setError('Passwords do not match')
      } else if (password.length < 8) {
        setError('Password must be at least 8 characters')
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setStep('email')
    setEmail('')
    setOtp('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    navigate("/signin");
  }

  return (
    <>
      <CloudBackground />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Email Step */}
          {step === 'email' && (
            <div className="glass rounded-2xl p-8 shadow-lg animate-in fade-in">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-muted-foreground">
                  Enter your email to receive a verification code
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className="h-11"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Sending...' : 'Send Code'}
                </Button>
              </form>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="glass rounded-2xl p-8 shadow-lg animate-in fade-in">
              <button
                onClick={() => setStep('email')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 mb-2">
                  Verify Code
                </h1>
                <p className="text-muted-foreground">
                  Enter the 6-digit code sent to <br />
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-center">
                  <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-14 text-xl font-bold rounded-lg border-2 border-purple-200 focus:border-purple-500"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Did not receive the code?{' '}
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </div>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <div className="glass rounded-2xl p-8 shadow-lg animate-in fade-in">
              <button
                onClick={() => setStep('otp')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 mb-2">
                  Set New Password
                </h1>
                <p className="text-muted-foreground">
                  Create a strong password for your account
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError('')
                    }}
                    className="h-11"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="glass rounded-2xl p-8 shadow-lg animate-in fade-in">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 mb-2">
                    Password Updated!
                  </h1>
                  <p className="text-muted-foreground">
                    Your password has been successfully changed. You can now log in with your new password.
                  </p>
                </div>

                <Button
                  onClick={handleReset}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
