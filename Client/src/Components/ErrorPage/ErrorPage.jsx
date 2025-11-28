// Components/ErrorPage/ErrorPage.jsx
import React from "react";
import {  useNavigate } from "react-router-dom";
// import { MdErrorOutline } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import NotFoundImage from "../../assets/nfound.svg"; // Add your own SVG image here

const ErrorPage = () => {
  const navigate = useNavigate();
  const handleBack =()=>{
    navigate(-1)
  }
  return (
    <div className="flex flex-col bg-white px-10 py-10 items-center justify-center !mt-6 !m-auto  w-[40%] text-center">
      {/* Icon and Header */}
      {/* <MdErrorOutline className="text-red-500 text-7xl mb-4" /> */}
 {/* Image */}
      <img
        src={NotFoundImage}
        alt="Page Not Found"
        className="!w-40 h-20 "
      />

      <h2 className="text-2xl font-semibold text-gray-700 ">404 Page Not Found</h2>

     
      {/* Description */}
      <p className="text-gray-600 max-w-md py-4">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Button */}
      <button
       onClick={handleBack} className="inline-flex items-center gap-2 px-6 !py-2 bg-[#591c64] text-white rounded hover:bg-[#7b2a89bc] transition"
      >
        <BiArrowBack className="text-xl" />
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
