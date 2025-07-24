import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { UNSAFE_WithComponentProps, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendurl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendurl + "/api/auth/send-reset-otp",
        {
          email,
        }
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
  e.preventDefault();
  const otpArray = inputRefs.current.map(input => input.value);
  const finalOtp = otpArray.join('');
  setOtp(finalOtp); // store it in state
  setIsOtpSubmitted(true); // show next form
};

const onSubmitNewPassword = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post(backendurl + "/api/auth/reset-password", {
      email,
      otp,
      newPassword,
    });

    if (data.success) {
      toast.success(data.message);
      navigate("/login"); //  redirect to homepage
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      {/* create a form to enter the email id */}

      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm ">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Email Id"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="w-full py-2.5 mt-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      }

      {/* otp input form */}

      {!isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitOtp} className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm ">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter new password below
          </p>

          <div onPaste={handlePaste} className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md border border-white "
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      }

      {/* Enter new password */}
      {isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitNewPassword} className="bg-slate-800 p-8 rounded-lg shadow-lg w-96 text-sm ">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none text-white"
              type="password"
              placeholder="Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-2.5 mt-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            Submit
          </button>
        </form>
      }
    </div>
  );
};

export default ResetPassword;
