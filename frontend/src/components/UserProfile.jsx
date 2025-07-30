import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaRegCalendarAlt,
  FaUserCircle,
  FaBirthdayCake,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import axios from "axios";
import { useSideBar } from "../contexts/SideBarContext";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = ({ username }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [error, setError] = useState(null);
  const { previous, setTab } = useSideBar();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();
  const [showFollowList, setShowFollowList] = useState(false);
  const [followTab, setFollowTab] = useState("followers");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/user/viewuser/${username}`
        );
        setUserProfile(res.data);
        console.log(res.data);
        if (
          res.data.followers.some(
            (follower) => follower.username === user.username
          )
        ) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading user profile.");
      }
    };

    fetchUser();
  }, [username, user]);

  const gotoHome = () => {
    if (previous) setTab(previous);
    else setTab("Home");
    navigate("/");
  };

  const handleFollowToggle = async () => {
    if (!user) return;
    try {
      const url = isFollowing
        ? `http://localhost:4000/api/user/unfollow/${userProfile._id}`
        : `http://localhost:4000/api/user/follow/${userProfile._id}`;
      await axios.put(url, { followerId: user.id });
      setIsFollowing(!isFollowing);
      setUserProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((fid) => fid !== user._id)
          : [...prev.followers, user._id],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const showProfile=(username)=>{
    setShowFollowList(false);
    if(user.username===username) navigate(`/i/${username}`);
    else navigate(`/u/${username}`);
  }

  if (error) return <div>{error}</div>;
  if (!userProfile) return <div className="p-4">Loading profile...</div>;

  const formattedDate = new Date(userProfile.createdAt).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );

  return (
    <div className="h-full w-full bg-white border border-r-yellow-200 border-l-yellow-200 overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 z-50 h-[70px] flex items-center gap-4 bg-white p-4 border-b border-yellow-200">
        <FaArrowLeft
          className="text-black cursor-pointer text-2xl"
          onClick={gotoHome}
        />
        <div className="ml-4 flex-1 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold">{userProfile.profilename}</div>
            <div className="text-gray-600">
              {userProfile.posts ? userProfile.posts.length : 0} posts
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[0px] border border-white border-b-yellow-300 pb-5">
        <div className="relative h-[180px] bg-yellow-100 flex items-end">
           {userProfile.coverPhoto && (
            <img
              src={`http://localhost:4000${userProfile.coverPhoto}`}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-[-40px] left-6 h-24 w-24 rounded-full bg-white border-[4px] border-white overflow-hidden flex items-center justify-center text-gray-400">
            {userProfile.profilePic ? (
              <img
                src={`http://localhost:4000${userProfile.profilePic}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-6xl text-yellow-400" />
            )}
          </div>
        </div>

        <div className="pt-12 px-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-2xl font-semibold">
                {userProfile.profilename}
              </div>
              <div className="text-gray-600">@{userProfile.username}</div>
            </div>
            {user && user._id !== userProfile._id && (
              <button
                onClick={handleFollowToggle}
                className={`bg-black text-white font-bold py-2 px-5 rounded-full ${
                  isFollowing
                    ? "hover:bg-gray-300 hover:text-red-600"
                    : "hover:bg-yellow-400 text-white"
                } cursor-pointer`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          {userProfile.bio && (
            <div className="text-md text-gray-900 mt-2">{userProfile.bio}</div>
          )}

          <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
            <FaRegCalendarAlt className="text-yellow-400 text-xl" />
            Joined on {formattedDate}
          </div>

          {userProfile.dob && (
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FaBirthdayCake className="text-yellow-400 text-xl" />
              Born on{" "}
              {new Date(userProfile.dob).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </div>
          )}

          <div className="flex gap-6 mt-4 text-sm">
            <div
              onClick={() => {
                setShowFollowList(true);
                setFollowTab("following");
              }}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="font-semibold text-black">
                {userProfile.following?.length || 0}
              </span>
              <span className="text-gray-500">Following</span>
            </div>
            <div
              onClick={() => {
                setShowFollowList(true);
                setFollowTab("followers");
              }}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span className="font-semibold text-black">
                {userProfile.followers?.length || 0}
              </span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-around border-b border-yellow-200 mt-2 text-sm font-medium text-gray-600">
        <button
          onClick={() => setActiveTab("posts")}
          className={`p-3 w-full ${
            activeTab === "posts"
              ? "border-b-2 border-yellow-500 text-black"
              : ""
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`p-3 w-full ${
            activeTab === "likes"
              ? "border-b-2 border-yellow-500 text-black"
              : ""
          }`}
        >
          Likes
        </button>
      </div>

      <div className="p-4">
        {activeTab === "posts" &&
          userProfile.posts
            ?.slice()
            .reverse()
            .map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}

        {activeTab === "likes" &&
          userProfile.likedPosts
            ?.slice()
            .reverse()
            .map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}

       
      </div>
      {showFollowList && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/90 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[400px] h-100 max-h-100 overflow-y-auto p-4 shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-3xl text-gray-900 hover:text-black cursor-pointer"
              onClick={() => setShowFollowList(false)}
            >
              X
            </button>
            <div className="flex justify-around mb-4 pb-2 ">
              <button
                onClick={() => setFollowTab("followers")}
                className={`text-sm font-medium ${
                  followTab === "followers"
                    ? "text-black border-b-2 border-yellow-400"
                    : "text-gray-500"
                }`}
              >
                Followers
              </button>
              <button
                onClick={() => setFollowTab("following")}
                className={`text-sm font-medium ${
                  followTab === "following"
                    ? "text-black border-b-2 border-yellow-400"
                    : "text-gray-500"
                }`}
              >
                Following
              </button>
            </div>
            <div className="space-y-3">
              {(followTab === "followers"
                ? userProfile.followers
                : userProfile.following
              )?.map((user, i) => (
                <div key={i} className="flex items-center gap-3 py-2 cursor-pointer" onClick={()=>showProfile(user.username)}>
                  {user.profilePic ? (
                    <img
                      src={`http://localhost:4000${user.profilePic}`}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-yellow-400" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {user.profilename || "Unnamed"}
                    </p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
