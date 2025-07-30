import { FaSearch } from "react-icons/fa";
import { useSearch } from "../contexts/SearchContext";
import { useSideBar } from "../contexts/SideBarContext";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Panel = () => {
  const { user } = useAuth();
  const { trending, allUsers } = useSearch();
  const { setTab } = useSideBar();
  const [userQuery, setUserQuery] = useState("");
  const navigate = useNavigate();

  const filteredUsers = userQuery.trim()
    ? allUsers.filter(
        (user) =>
          user.profilename.toLowerCase().includes(userQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(userQuery.toLowerCase())
      )
    : [];

  const randomUsers = [...allUsers].sort(() => 0.5 - Math.random()).slice(0, 4);

  const viewProfile = (profile) => {
    if (user.username == profile) navigate(`/i/${profile}`);
    else navigate(`/u/${profile}`);
  };

  return (
    <div className="w-full h-full bg-white text-black flex flex-col">
      <div className="sticky top-0 z-10 bg-white p-6 border-b border-yellow-200">
        <div className="flex items-center gap-3 border border-yellow-400 rounded-full px-4 py-2 shadow-md">
          <FaSearch className="text-yellow-500 text-lg" />
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 outline-none bg-transparent placeholder-gray-500"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Discover People
          </h2>
          <div className="space-y-3">
            {(filteredUsers.length > 0 ? filteredUsers : randomUsers).map(
              (user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-yellow-50 px-4 py-3 rounded-lg shadow hover:bg-yellow-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {user.profilePic != "" ? (
                      <img
                        src={`http://localhost:4000${user.profilePic}`}
                        alt={user.profilename}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-4xl text-yellow-400" />
                    )}
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {user.profilename || user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.username}
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-full transition"
                    onClick={() => viewProfile(user.username)}
                  >
                    View
                  </button>
                </div>
              )
            )}

            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                What's Trending
              </h3>
              <div className="flex flex-col gap-3">
                {trending
                  .filter((trend) => parseInt(trend.count) > 0)
                  .map((trend, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setTab("Search");
                        navigate("/");
                      }}
                      className="flex justify-between items-center px-4 py-4 bg-white hover:bg-yellow-50 rounded-lg border-2 border-yellow-200 shadow-sm cursor-pointer transition"
                    >
                      <div className="text-sm font-medium text-yellow-900">
                        {trend.tag}
                      </div>
                      <div className="text-xs text-gray-600">
                        {trend.count} posts
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
