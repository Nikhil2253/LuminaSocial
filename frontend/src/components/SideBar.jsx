import {
  FiSun,
  FiHome,
  FiMessageCircle,
  FiUser,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiEdit2,
  FiSearch
} from "react-icons/fi";

import {
  FaHome,
  FaSearch,
  FaRegCommentDots,
  FaUser,
  FaBookmark,
  FaCog,
} from "react-icons/fa";

import { useSideBar } from "../contexts/SideBarContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", icon: FiHome, filled: FaHome },
  { label: "Search", icon: FiSearch, filled: FaSearch },
  { label: "Messaging", icon: FiMessageCircle, filled: FaRegCommentDots },
  { label: "Profile", icon: FiUser, filled: FaUser },
  { label: "Bookmarks", icon: FiBookmark, filled: FaBookmark },
  { label: "Settings", icon: FiSettings, filled: FaCog },
];

const SideBar = () => {
  const { tab,previous,setTab,setPrevious } = useSideBar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-5 h-full flex flex-col justify-between">
      <div>
        <div className="pb-4 mb-6 border-b border-yellow-200 text-2xl font-bold flex items-center gap-3">
          <FiSun className="text-4xl text-yellow-500" />
          LuminaSocial
        </div>

        <div className="flex flex-col pt-5 gap-3">
          {navItems.map(({ label, icon: OutlineIcon, filled: FilledIcon }) => {
            const isProfile = label === "Profile";

            return (
              <div
                key={label}
                onClick={() => {
                  if (isProfile) {
                    setPrevious(tab);
                    setTab(label);
                    navigate(`/i/${user.username}`);
                  } else {
                    setPrevious(tab);
                    setTab(label);
                    navigate("/");
                  }
                }}
                className="group flex items-center gap-3 text-lg px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-yellow-100"
              >
                <span className="text-2xl text-gray-800 group-hover:hidden">
                  <OutlineIcon />
                </span>
                <span className="text-2xl hidden text-yellow-500 group-hover:block">
                  <FilledIcon />
                </span>
                <span className="group-hover:text-black font-semibold">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <div
            className="group flex items-center justify-center gap-3 w-full bg-yellow-400 hover:bg-yellow-500 text-white text-lg font-semibold py-2 rounded-lg cursor-pointer transition-all"
            onClick={() => {
              setPrevious(tab);
              setTab("Post");
            }}
          >
            <FiEdit2 className="text-xl group-hover:scale-110 transition-transform" />
            <span>Post</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 px-2">
        <div className="flex items-center gap-3">
          {user?.profilePic ? (
            <img
              src={`http://localhost:4000${user.profilePic}`}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {user?.profilename || "Full Name"}
            </span>
            <span className="text-xs text-gray-500">@{user?.username || "username"}</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-red-500 bg-white border p-2 rounded-lg hover:text-red-600 hover:bg-gray-200 text-xl transition-all"
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
