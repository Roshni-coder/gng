import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Admincontext } from '../../Components/context/admincontext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [isOtpScreen, setIsOtpScreen] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
const [phone, setPhone] = useState('');

  const { backendurl, setatoken } = useContext(Admincontext);
  const navigate = useNavigate();

  const registerSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(backendurl + "/api/seller/register", {
      name, email, password, nickName,phone
    });

    if (data.success) {
      toast.success(data.message);
      setIsOtpScreen(true);
    } else {
      toast.error(data.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(backendurl + "/api/seller/verify-otp", {
      email, otp
    });

    if (data.success) {
      localStorage.setItem("stoken", data.token);
      setatoken(data.token);
      navigate("/seller-profile"); 
      toast.success("OTP verified, login success");
    } else {
      toast.error(data.message);
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(backendurl + "/api/seller/login", {
      email, password
    });

    if (data.success) {
      localStorage.setItem("stoken", data.token);
      setatoken(data.token);
      navigate("/");
      toast.success("Login successful");
    } else {
      toast.error(data.message);
    }
  };

  return (
  <form className="min-h-screen flex items-center justify-center bg-gray-100">

    <div className="w-full max-w-lg bg-white p-10 shadow-xl rounded-xl border border-gray-200">

      {/* OTP SCREEN */}
      {isOtpScreen ? (
        <>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Enter OTP
          </h2>

          <input
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
            onClick={verifyOtp}
          >
            Verify OTP
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            {isRegister ? "Create Seller Account" : "Seller Login"}
          </h2>

          {isRegister && (
            <>
              <input
                className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brand Name"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />

              <input
                className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            className="w-full p-3 mb-4 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer
                         hover:text-gray-700 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={1.5}
                  stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.5 12c2.28 4.08 6.37 7 10.5 7 2.042 0 4.087-.53 6.02-1.777M3.98 8.223L1.493 5.736m2.487 2.487L12 15m0 0l8.02 8.02m-8.02-8.02l2.487-2.487m-2.487 2.487L5.736 3.98" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={1.5}
                  stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.307 4.5 12 4.5c4.694 0 8.578 3.01 9.964 7.183.07.207.07.431 0 .639C20.578 16.49 16.694 19.5 12 19.5c-4.693 0-8.577-3.01-9.964-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
            onClick={isRegister ? registerSubmit : loginSubmit}
          >
            {isRegister ? "Create Account" : "Login"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            {isRegister ? "Already have an account?" : "New seller?"}{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </>
      )}

    </div>
  </form>
);

}

export default Login;
