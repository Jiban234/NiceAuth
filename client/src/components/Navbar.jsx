import React, { useContext } from "react";
import { assets } from "../assets/assets";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendurl, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl + '/api/auth/logout');
      if(data.success){
        setIsLoggedin (false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="" className="w-28 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group ">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none p-2 m-0 bg-gray-100 text-sm">
              {!userData.isVerified ? (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              ) : null}
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-300 transition-all"
        >
          Login <img src={assets.arrow_icon} />
        </button>
      )}
    </div>
  );
};

export default Navbar;
