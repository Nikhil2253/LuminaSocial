import { FiSun, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Scenery from "../assets/Scenery.png";
import Success from "../components/Success";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords are not the same!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/auth/register", {
        username,
        email,
        password,
      });

      console.log("Registered:", response.data);

      setSuccessMessage(response.data.message);
      setTimeout(()=>{
        setSuccessMessage("");
      },2000);

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      showError(error.response?.data?.message || "Registration failed.");
    }
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage("");
    }, 5000);
  };

  return (
    <div className="w-full h-screen bg-yellow-100 flex justify-center items-center px-6 py-10 relative">
      {errorMessage && <Error message={errorMessage} />}
      {successMessage && <Success message={successMessage}/>}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="relative md:w-1/2 w-full h-64 md:h-auto">
          <img
            src={Scenery}
            alt="Scenery"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 w-full p-10 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-center mb-6 space-x-3">
            <FiSun className="text-yellow-500 text-4xl" />
            <h1 className="text-3xl font-bold text-yellow-500">LuminaSocial</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div
                className="absolute right-3 top-3 text-xl text-yellow-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pr-10 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
              <div
                className="absolute right-3 top-3 text-xl text-yellow-600 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-md transition-all"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              className="text-yellow-600 font-medium cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
