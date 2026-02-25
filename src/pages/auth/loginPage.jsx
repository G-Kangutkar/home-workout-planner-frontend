
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function Login() {
  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false)
  const navigate = useNavigate();
  const handleInputs = (e) => {
    const { name, value } = e.target;

    setInputData(prev => ({
      ...prev, [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/register/login', inputData);
      console.log('Signup successful!', response.data);
      toast.success("Account created successfully!")
      const token = response?.data?.accessToken;
      // console.log('Extracted token:', token);
      localStorage.setItem('token', token);
      navigate('/profile')
    } catch (error) {
      console.log('error at handling form submission', error.message);
      const serverMessage = error.response?.data?.error || error.message;

       toast.error(serverMessage)
    }
    finally {
      setLoading(false)
    }
  }


  return (

    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070a04]">

      {/* ── Gradient mesh blobs ── */}
      <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full bg-lime-500/25 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-105 h-105 rounded-full bg-green-400/20 blur-[100px] animate-pulse [animation-delay:1.5s] pointer-events-none" />
      <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-70 h-70 rounded-full bg-lime-300/15 blur-[90px] animate-pulse [animation-delay:3s] pointer-events-none" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-105 mx-4 rounded-3xl p-10 bg-white/5 backdrop-blur-2xl border border-lime-400/10 shadow-[0_0_0_1px_rgba(163,230,53,0.05),0_8px_40px_rgba(0,0,0,0.6),0_32px_80px_rgba(0,0,0,0.4),0_0_100px_rgba(163,230,53,0.12),inset_0_1px_0_rgba(163,230,53,0.08)]">

        {/* Logo mark */}
        <div className="flex items-center mb-8 gap-8">

          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-lime-400 to-green-600 flex items-center justify-center shadow-[0_4px_20px_rgba(163,230,53,0.45)]">
            <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Header */}

          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Welcome back
          </h1>
        </div>
        <div className="mb-8">
          <button
            onClick={() => navigate("/signup")}
            className="mt-3 text-xs text-lime-400 hover:text-lime-300 transition-colors duration-200 font-medium cursor-pointer bg-transparent border-none"
          >
            Don't have an account? Sign up →
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[11px] font-semibold uppercase tracking-widest text-lime-400/60"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleInputs}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 bg-white/6 border border-white/10 outline-none transition-all duration-200 focus:border-lime-400/70 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(163,230,53,0.2),0_0_20px_rgba(163,230,53,0.08)]"
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-widest text-lime-400/60"
              >
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name='password'
                type={show ? "text" : "password"}
                onChange={handleInputs}
                value={inputData.password}
                required
                className="bg-white/6 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-400/70 focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(163,230,53,0.2),0_0_20px_rgba(163,230,53,0.08)] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:bg-lime-300"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-lime-400/15 to-transparent" />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-black tracking-wide bg-linear-to-r from-lime-400 via-lime-300 to-green-400 flex items-center justify-center gap-2.5 shadow-[0_4px_24px_rgba(163,230,53,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_32px_rgba(163,230,53,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer border-none"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin shrink-0" />
            )}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-white/20">
          By continuing, you agree to our{" "}
          <button className="text-lime-400/60 hover:text-lime-300 transition-colors bg-transparent border-none cursor-pointer text-[11px]">
            Terms
          </button>{" "}
          &amp;{" "}
          <button className="text-lime-400/60 hover:text-lime-300 transition-colors bg-transparent border-none cursor-pointer text-[11px]">
            Privacy Policy
          </button>
        </p>
      </div>
    </section>

  )
}
export default Login;