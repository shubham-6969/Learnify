import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../Utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {

      setIsLoggedIn(false);
    }
  }, []);
  // fetcing data from datab
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses", error);
      }
    };
    fetchCourses();
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
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("error in logging out", error);
      toast.error(Error.response.data.message || "Error in logging out");
    }
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className=" min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 ">
          <div className="flex items-center space-x-1">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">Learnify</h1>
          </div>
          <div className="space-x-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded  transition duration-300 ease-in-out hover:border-orange-500 hover:text-orange-500"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md  transition duration-300 ease-in-out hover:border-orange-500 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-orange-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md text-white transition duration-300 ease-in-out hover:bg-orange-600"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Main section */}
        <section className="text-center">
          <h1 className="text-4xl font-semibold text-orange-500">Learnify</h1>
          <br />
          <p className="text-gray-500">
            "At Learnify, experts craft courses to help users sharpen their
            skills effectively."
          </p>
          <div className="space-x-4 mt-8">
            <Link to={"/courses"} 
              className="bg-green-500 text-white rounded py-3 px-6 font-semibold hover:bg-white duration-300 hover:text-black"
            >
              Explore Courses
            </Link >
            <Link to={"https://www.youtube.com/@LearnCodingOfficial"}
              className="bg-white text-black rounded py-3 px-6 font-semibold hover:bg-green-500 duration-300 hover:text-white"
            >
              Courses Video
            </Link >
          </div>
        </section>
        <section className="mt-12">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w=92 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white mb-4">
                        {course.title}
                      </h2>
                      <Link to={`/buy/${course._id}`} 
                      className="mt-8 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* Footer */}
        <footer className="  py-4">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">Learnify</h1>
              </div>
              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2 flex flex-col items-center">Follow us</p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/shubham.patwal.017/">
                    <FaFacebook className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                  <a href="https://www.linkedin.com/in/shubham-patwal-87656427b/">
                    <FaLinkedin className="text-2xl hover:text-blue-600 duration-300" />
                  </a>
                  <a href="https://x.com/Shubham14702365?t=K313WdYxdCthdtkAiVg6aQ&s=09">
                    <FaSquareXTwitter className="text-2xl hover:text-gray-500 duration-300" />
                  </a>
                  <a href="https://www.instagram.com/shades_ofgreen__/">
                    <FaInstagramSquare className="text-2xl hover:text-pink-600 duration-300" />
                  </a>
                </div>
              </div>
            </div>
            <div className="items-center mt-6 md:mt-0  flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">Connect</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  youtube- Learnify
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  telegram- Learnify
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Githud- Learnify
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Copyright</h3>
              <ul className=" space-y-2 text-gray-400 flex flex-col items-center">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Copyright &#169; 2025 Learnify All Rights Reserved{" "}
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy, Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default Home;
