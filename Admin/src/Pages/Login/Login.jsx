import React, { useContext, useState } from 'react';
import { Admincontext } from '../../Components/context/admincontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { backendurl, setatoken } = useContext(Admincontext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const url = `${backendurl}/api/admin/${isRegister ? 'register' : 'login'}`;
      const payload = isRegister ? { name, email, password } : { email, password };
      const { data } = await axios.post(url, payload);

      if (data.success) {
        localStorage.setItem('atoken', data.token);
        localStorage.setItem('name', isRegister ? data.name : data.user.name);
        setatoken(data.token);
        alert(isRegister ? 'Admin Registered Successfully ✅' : 'Admin Login Successful ✅');
        navigate('/');
      } else {
        alert(data.message || 'Something went wrong ❌');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Server Error ❌');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
          {isRegister ? 'Register Admin' : 'Welcome Back!'}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {isRegister ? 'Create a new admin account.' : 'Sign in to manage your dashboard.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {!isRegister && (
            <div className="flex justify-end text-sm text-gray-500">
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-300"
          >
            {isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login here' : 'Register here'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
