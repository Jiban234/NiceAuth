import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();
export const AppContextProvider = (props) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
        const {data} = await axios.get(backendurl + 'api/auth/is-auth');
        if(data.success){
            setIsLoggedin(true);
            await getUserData();
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/user/data", {
        withCredentials: true,
      });

      data.success ? setUserData(data.userData) : toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    getAuthState();
  },[])

  const value = {
    backendurl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
