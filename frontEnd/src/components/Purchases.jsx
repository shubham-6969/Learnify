import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import {  RiHome2Fill } from 'react-icons/ri';
import { BACKEND_URL } from '../../Utils/utils';

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);

  const navigate = useNavigate();
 

  console.log("purchases: ",purchases);
  // token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  // fetcing data from datab
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
      const fetchPurchases = async() => {
      if(!token){
        setErrorMessage("Please login to view your courses");
        return;
      } 
     try {
       const response = await axios.get(`${BACKEND_URL}/user/purchases/`,  {
          headers: {
            Authorization: `Bearer ${token}`
          },
         withCredentials: true,
       });
       // console.log("response from :", response.data)
      setPurchase(response.data.courseData);
     } catch (error) {
     setErrorMessage("Failed to fetch purchase data", error);
     }
    };
    fetchPurchases();
  }, []);
  

 // logout function
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user")
      navigate('/login');
      setIsLoggedIn(false);
    } catch (error) {
      console.log("error in logging out", error);
      toast.error(Error.response.data.message || "Error in logging out");
    }
  };

  // toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" onClick={() => console.log("Navigating to purchases")} className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">
          My Purchases
        </h2>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Course Image */}
                  <img
                    className="rounded-lg w-full h-48 object-cover"
                    src={
                      purchase.image?.url || "https://via.placeholder.com/200"
                    }
                    alt={purchase.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{purchase.title}</h3>
                    <p className="text-gray-500">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                    &#8377;{purchase.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}
export default Purchases;