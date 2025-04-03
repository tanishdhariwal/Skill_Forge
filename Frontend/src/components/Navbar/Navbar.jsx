// import React, { useState, useEffect, useRef } from 'react';
// import { CgProfile } from 'react-icons/cg';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import Content from '../Content/Content';
// import GenerateContent from '../GenerateContent/GenerateContent';
// import Progress from '../Progress/Progress';
// import Topic from '../Topic/Topic';
// import { useAuth } from '../../services/AuthService';
// import Streak from "../Streak";
// import { AiFillFire } from "react-icons/ai";
// import {useAuth} from "../services/AuthService";




// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [streak, setStreak] = useState(0);
//   const [email, setEmail] = useState("");

//   const { isAuthenticated, logout, user } = useAuth();

//   const name = user?.name;
//   const email = user?.email;

//   const pathname = location.pathname.split('/');

  
//   // console.log(pathname[1]);


//   const [streak, setStreak] = useState(0);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     const fetchStreak = async () => {
//       try {
//         const user = AuthService.getCurrentUser(); // Get user details
//         if (user && user.email) {
//           setEmail(user.email);
//           const response = await axios.get(`/api/streak?email=${user.email}`);
//           setStreak(response.data.streak || 0);
//         }
//       } catch (error) {
//         console.error("Error fetching streak:", error);
//       }
//     };

//     fetchStreak();
//   }, []);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const navigateTo = (path) => {
//     navigate(path);
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <nav className="bg-[#e1dfde] border-gray-200 sticky top-0 z-50 shadow-md h-[max(80px,10vh)] transition-all duration-300">
//       <div className="max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between">
//         <Link to="/" className="flex items-center">
//           <img src="/Logo.png" alt="" className="h-12" />
//         </Link>
//         <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
//           <button
//             type="button"
//             className="flex text-sm text-black rounded-full md:me-0"
//             id="user-menu-button"
//             aria-expanded={isDropdownOpen}
//             onClick={toggleDropdown}
//           >
//             <span className="sr-only">Open user menu</span>
//             <CgProfile size={28} />
//           </button>
//           {/* Dropdown menu */}
//           <div
//             className={`absolute transition-all mt-2 w-60 right-0 divide-y bg-[#e6e6e6] divide-gray-100 rounded-lg shadow ${isDropdownOpen ? 'block' : 'hidden'}`}
//             ref={dropdownRef}
//             id="user-dropdown"
//             style={{ top: '100%' }} // Ensure the dropdown is below the button
//             onClick={() => setIsDropdownOpen(false)}
//           >
//             <div className="px-4 py-3">
//               <span className="block text-sm text-gray-900">{name}</span>
//               <span className="block text-sm text-gray-500 truncate ">{email}</span>
//             </div>
//             <ul className="py-2 " aria-labelledby="user-menu-button">
//               <li>
//                 <Link
//                   to="/settings"
//                   className={`${pathname[2] in ['dashboard', 'languages', 'topics', 'content'] ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 rounded-lg`}
//                   onClick={() => navigateTo('/settings')}
//                 >
//                   Settings
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/login"
//                   className={`${location.pathname === '/login' ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 rounded-lg`}
//                   onClick={() => logout()}
//                 >
//                   Logout
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <button
//             data-collapse-toggle="navbar-user"
//             type="button"
//             className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200"
//             aria-controls="navbar-user"
//             aria-expanded={isMobileMenuOpen}
//             onClick={toggleMobileMenu}
//           >
//             <span className="sr-only">Open main menu</span>
//               <svg
//                 className="w-5 h-5"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//           </button>
//         </div>
//         <div
//           className={`items-center  justify-between md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'fixed top-0 right-0 bottom-0 left-0 z-50' : 'hidden'}`}
//           id="navbar-user"
//           style={{ backdropFilter: isMobileMenuOpen ? 'blur(8px)' : 'none' }}
//         >
//           <ul className="md:flex justify-center font-medium mt-4 lg:mt-0  p-4 rounded-lg  md:space-x-8 rtl:space-x-reverse md:border-0">
//             <li>
//               <button
//                 type="button"
//                 className={`${isMobileMenuOpen ? 'block' : 'hidden'} items-center text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
//                 onClick={toggleMobileMenu}
//               >
//                 <svg
//                   className="w-7 h-7 mb-5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </li>
//             <li>
//               <Link
//                 to="/"
//                 className={`${location.pathname === '/' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
//                 aria-current="page"
//                 onClick={() => navigateTo('/')}
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`${pathname[1] === 'dashboard' || pathname[1] === 'languages' || pathname[1] === 'topics' || pathname[1] === 'content' || pathname[1] === 'frontend' || pathname[1] === 'backend' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
//                 onClick={() => navigateTo('/dashboard')}
//               >
//                 Dashboard
//               </Link>
//             </li>
        
            
//             <li>
//               <Link
//                 to="/interview"
//                 className={`${location.pathname === '/interview' ? 'bg-[#4f4f4f] text-white' : ''} text-sm font-semibold block py-2 px-3 text-black rounded-full transition-colors duration-200 hover:bg-[#4f4f4f] hover:text-white md:p-2`}
//                 onClick={() => navigateTo('/interview')}
//                 >
//                  Interview
//                 </Link>
//             </li>
//             <li>
//               <Link
//               to="/streak"
//               onClick={() => navigateTo('/streak')}
//               >
//                 {/* <AiFillFire size={25} color="red"/> */}
//                 <span style={{ fontSize: "20px" }}>🔥</span>
//                 <span style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "5px" }}>
//                 {streak}
//                 </span>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect, useRef } from 'react';
import { CgProfile } from 'react-icons/cg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthService';
import axios from 'axios'; // Ensure axios is imported

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [streak, setStreak] = useState(0);
  const { isAuthenticated, logout, user } = useAuth();

  const name = user?.name;
  const email = user?.email;

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        if (isAuthenticated && email) {
          // Fetch the streak data for the authenticated user
          const response = await axios.get(`http://localhost:3000/api/streak?email=${email}`);
          if (response.data && response.data.streak !== undefined) {
            setStreak(response.data.streak); // Update the streak state
          } else {
            setStreak(0); // Default to 0 if streak is not found
          }
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
        setStreak(0); // Default to 0 in case of error
      }
    };

    if (isAuthenticated && email) {
      fetchStreak(); // Fetch streak only if the user is authenticated and has a valid email
    }
  }, [isAuthenticated, email]); // Runs whenever `isAuthenticated` or `email` changes

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#e1dfde] border-gray-200 sticky top-0 z-50 shadow-md h-[max(80px,10vh)] transition-all duration-300">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/Logo.png" alt="" className="h-12" />
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          <button
            type="button"
            className="flex text-sm text-black rounded-full md:me-0"
            aria-expanded={isDropdownOpen}
            onClick={toggleDropdown}
          >
            <CgProfile size={28} />
          </button>
          {/* Dropdown menu */}
          <div
            className={`absolute transition-all mt-2 w-60 right-0 divide-y bg-[#e6e6e6] divide-gray-100 rounded-lg shadow ${
              isDropdownOpen ? "block" : "hidden"
            }`}
            ref={dropdownRef}
            style={{ top: "100%" }}
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">{name}</span>
              <span className="block text-sm text-gray-500 truncate">{email}</span>
            </div>
            <ul className="py-2">
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={() => navigateTo("/settings")}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? "block" : "hidden"}`}>
          <ul className="md:flex justify-center font-medium mt-4 lg:mt-0 p-4 rounded-lg md:space-x-8">
            <li>
              <Link
                to="/"
                className="text-sm font-semibold block py-2 px-3 text-black rounded-full hover:bg-gray-700 hover:text-white"
                onClick={() => navigateTo("/")}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-sm font-semibold block py-2 px-3 text-black rounded-full hover:bg-gray-700 hover:text-white"
                onClick={() => navigateTo("/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/interview"
                className="text-sm font-semibold block py-2 px-3 text-black rounded-full hover:bg-gray-700 hover:text-white"
                onClick={() => navigateTo("/interview")}
              >
                Interview
              </Link>
            </li>
            <li>
              <Link
                to="/streak"
                className="flex items-center text-sm font-semibold py-2 px-3 text-black rounded-full hover:bg-gray-700 hover:text-white"
                onClick={() => navigateTo("/streak")}
              >
                <span className="text-2xl">🔥</span>
                <span className="text-lg font-bold ml-2">{streak}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
