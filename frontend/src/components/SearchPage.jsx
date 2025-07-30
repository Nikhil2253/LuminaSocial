import { useState } from "react";
import {
  FaSearch,
  FaFire,
  FaUser,
  FaSyncAlt,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";
import { useSearch } from "../contexts/SearchContext";
import axios from "axios";
import BookPostCard from "./BookPostCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const SearchPage = () => {
  const { user } = useAuth();
  const { trending, setTrending, allUsers } = useSearch();
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [tagPosts, setTagPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/tags/");
      const sorted = res.data
        .sort((a, b) => b.count - a.count)
        .slice(0, 30)
        .map((tag, index) => ({
          id: index + 1,
          tag: `#${tag.value}`,
          count: `${tag.count} posts`,
        }));
      setTrending(sorted);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tagText) => {
    try {
      const tag = tagText.replace("#", "");
      const res = await axios.get(
        `http://localhost:4000/api/post/getbytag/${tag}`
      );
      setTagPosts(res.data);
      setSelectedTag(tagText);
    } catch (err) {
      console.error("Failed to fetch posts by tag:", err);
    }
  };

  const filteredTags = tagQuery.trim()
    ? trending.filter((trend) =>
        trend.tag.toLowerCase().includes(tagQuery.toLowerCase())
      )
    : trending;

  const handleBack = () => {
    setSelectedTag(null);
    setTagPosts([]);
  };

  const viewProfile = (profile) => {
    if (user.username == profile) navigate(`/i/${profile}`);
    else navigate(`/u/${profile}`);
  };

  return (
    <div className="w-full h-full flex font-sans">
      <div className="w-[60%] h-full bg-white text-black border-r-2 border-yellow-300 flex flex-col">
        <div className="sticky top-0 z-10 bg-white p-6 border-b border-yellow-200">
          <div className="flex items-center gap-3 border border-yellow-400 rounded-full px-4 py-2 shadow-md">
            <FaSearch className="text-yellow-500 text-lg" />
            <input
              type="text"
              placeholder="Search posts by tags..."
              className="flex-1 outline-none bg-transparent placeholder-gray-500"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {selectedTag && (
              <>
                <div
                  className="flex items-center gap-2 mb-4 text-yellow-600 cursor-pointer"
                  onClick={handleBack}
                >
                  <FaArrowLeft />
                  <span className="font-semibold">Back to Trends</span>
                </div>
                <div className="mb-6 space-y-4">
                  {tagPosts.map((post, i) => (
                    <BookPostCard key={post._id} post={post} index={i} />
                  ))}
                </div>
              </>
            )}

            {!selectedTag && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FaFire className="text-yellow-500" />
                    <h2 className="text-2xl font-bold tracking-tight">
                      Trending Now
                    </h2>
                  </div>
                  <button
                    onClick={fetchTags}
                    className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-800 transition"
                  >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredTags
                    .filter((trend) => parseInt(trend.count) > 0)
                    .map((trend) => (
                      <div
                        key={trend.id}
                        onClick={() => handleTagClick(trend.tag)}
                        className="cursor-pointer flex justify-between items-center bg-gradient-to-r from-yellow-50 to-white hover:from-yellow-100 transition-all px-4 py-4 rounded-md shadow-sm border border-yellow-300"
                      >
                        <div className="text-lg font-semibold text-gray-800">
                          {trend.tag}
                        </div>
                        <div className="text-sm text-yellow-600 font-medium">
                          {trend.count}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            <div className="mt-12 text-center text-sm text-gray-400">
              <div className="flex justify-center items-center gap-1">
                <FaUser className="text-gray-400" />
                LuminaSocial@2k25
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[40%] h-full bg-white text-black flex flex-col">
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
              {(userQuery.trim()
                ? allUsers.filter(
                    (user) =>
                      user.profilename
                        .toLowerCase()
                        .includes(userQuery.toLowerCase()) ||
                      user.username
                        .toLowerCase()
                        .includes(userQuery.toLowerCase())
                  )
                : []
              ).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between bg-yellow-50 px-4 py-3 rounded-lg shadow hover:bg-yellow-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {user.profilePic != "" ? (
                      <img
                        src={`http://localhost:4000${user.profilePic}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-4xl text-yellow-400" />
                    )}
                    <div>
                      <div className="text-lg font-semibold text-gray-800">
                        {user.profilename}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.username}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => viewProfile(user.username)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-full transition"
                  >
                    View
                  </button>
                </div>
              ))}

              {(userQuery.trim() === "" ||
                allUsers.filter(
                  (user) =>
                    user.profilename
                      .toLowerCase()
                      .includes(userQuery.toLowerCase()) ||
                    user.username
                      .toLowerCase()
                      .includes(userQuery.toLowerCase())
                ).length === 0) &&
                [...allUsers]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 4)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between bg-yellow-50 px-4 py-3 rounded-lg shadow hover:bg-yellow-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {user.profilePic != "" ? (
                          <img
                            src={`http://localhost:4000${user.profilePic}`}
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-4xl text-yellow-400" />
                        )}
                        <div>
                          <div className="text-lg font-semibold text-gray-800">
                            {user.profilename}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => viewProfile(user.username)}
                        className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-full transition"
                      >
                        View
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
