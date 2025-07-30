import { useState } from "react";
import { ChevronRight, ChevronLeft, Sun } from "lucide-react";
import EditProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Error from "./Error";

const settingsSections = [
  {
    title: "Edit Profile",
    description: "Change your profile picture, bio and username",
    key: "profile",
  },
  {
    title: "Delete Account",
    description: "Permanently remove your account and all data",
    key: "account",
  },
];

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:4000/api/user/delete", {
        username: user.username,
        password,
      });
      if (res.status === 200) {
        logout();
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-red-600">Delete Account</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        This action is <span className="font-semibold text-red-700">permanent</span>. 
        All your data including posts, messages, and activity history will be removed forever.
        Please confirm your password to continue.
      </p>

      {error && <Error message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-lg hover:from-red-700 hover:to-red-800 shadow-md transition duration-150"
        >
          Confirm & Delete Account
        </button>
      </form>
    </div>
  );
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <EditProfile />;
      case "account":
        return <DeleteAccount />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-white text-black">
      {activeSection ? (
        <div className="space-y-6">
          <button
            onClick={() => setActiveSection(null)}
            className="flex items-center gap-2 text-sm text-black hover:underline"
          >
            <ChevronLeft size={18} />
            Back to Settings
          </button>
          {renderSection()}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-8 text-black">Settings</h1>
          <div className="space-y-5">
            {settingsSections.map((section) => (
              <div
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className="flex justify-between items-center border border-gray-200 p-5 rounded-lg hover:shadow-md cursor-pointer transition"
              >
                <div>
                  <p className="font-medium text-lg">{section.title}</p>
                  <p className="text-gray-500 text-sm">{section.description}</p>
                </div>
                <ChevronRight className="text-yellow-500" size={22} />
              </div>
            ))}
          </div>
        </>
      )}
      {!activeSection && (
        <div className="mt-12 flex justify-center items-center gap-2 text-xl text-gray-400">
          <Sun size={30} className="text-yellow-500" />
          <span className="text-black font-medium">LuminaSocial</span>
        </div>
      )}
    </div>
  );
};

export default Settings;
