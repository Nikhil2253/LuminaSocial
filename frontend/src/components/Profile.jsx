import { useEffect, useState, useRef } from "react";
import { useProfile } from "../contexts/ProfileContext";
import {
  FaArrowLeft,
  FaRegCalendarAlt,
  FaUserCircle,
  FaBirthdayCake,
} from "react-icons/fa";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import { useSideBar } from "../contexts/SideBarContext";
import { Pencil, Camera } from "lucide-react";
import axios from "axios";

const Profile = () => {
  const { profile } = useProfile();
  const { previous, setTab } = useSideBar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  if (!profile) return <div>Error Loading Profile ...</div>;

  const formattedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );

  const gotoHome = () => {
    if (previous) setTab(previous);
    else setTab("Home");
    navigate("/");
  };

  const handleProfilePhotoClick = () => profileInputRef.current.click();
  const handleCoverPhotoClick = () => coverInputRef.current.click();

  const handleProfileFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedProfileImage(e.target.files[0]);
    }
  };

  const handleCoverFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedCoverImage(e.target.files[0]);
    }
  };

  const handleProfileUpload = async () => {
    const formData = new FormData();
    formData.append("profilePic", selectedProfileImage);
    formData.append("username", profile.username);
    try {
      await axios.post(
        "http://localhost:4000/api/user/upload/profilepic",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSelectedProfileImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCoverUpload = async () => {
    const formData = new FormData();
    formData.append("coverPhoto", selectedCoverImage);
    formData.append("username", profile.username);
    try {
      await axios.post(
        "http://localhost:4000/api/user/upload/coverphoto",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSelectedCoverImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const editProfile=()=>{
    setTab("Settings");
    navigate("/");
  }

  return (
    <div className="h-full w-full bg-white border border-r-yellow-200 border-l-yellow-200 overflow-y-auto custom-scrollbar">
      <input
        type="file"
        ref={profileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleProfileFileChange}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverFileChange}
      />
      <div className="sticky top-0 z-50 h-[70px] flex items-center gap-4 bg-white p-4 border-b border-yellow-200">
        <FaArrowLeft
          className="text-black cursor-pointer text-2xl"
          onClick={gotoHome}
        />
        <div className="ml-4">
          <div className="text-xl font-bold">{profile.profilename}</div>
          <div className="text-gray-600">
            {profile.posts ? profile.posts.length : 0} posts
          </div>
        </div>
      </div>

      <div className="mt-[0px] border border-white border-b-yellow-300 pb-5">
        <div className="relative h-[180px] bg-yellow-100 flex items-end">
          <div
            className="absolute top-2 right-2 bg-white rounded-full p-1 z-50 shadow cursor-pointer hover:bg-yellow-50 transition"
            onClick={handleCoverPhotoClick}
          >
            <Pencil className="w-4 h-4 text-yellow-600" />
          </div>

          {profile.coverPhoto && (
            <img
              src={`http://localhost:4000${profile.coverPhoto}`}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          <div
            className="absolute bottom-[-40px] left-6 group h-24 w-24 rounded-full bg-white border-[4px] border-white overflow-hidden cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            {profile.profilePic ? (
              <img
                src={`http://localhost:4000${profile.profilePic}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-yellow-400">
                <FaUserCircle className="text-6xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/70 bg-opacity-40 hidden group-hover:flex items-center justify-center">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>

          <div className="absolute z-10 bottom-2 right-4">
            <button
              className="px-4 py-1 border border-yellow-400 text-black bg-white rounded-full text-sm hover:bg-yellow-50 transition cursor-pointer"
              onClick={editProfile}
            >
              Edit profile
            </button>
          </div>
        </div>

        {(selectedProfileImage || selectedCoverImage) && (
          <div className="flex justify-center mt-2 gap-4">
            {selectedProfileImage && (
              <button
                className="bg-yellow-500 text-white px-4 py-1 rounded-full hover:bg-yellow-600 transition text-sm"
                onClick={handleProfileUpload}
              >
                Confirm Profile Pic
              </button>
            )}
            {selectedCoverImage && (
              <button
                className="bg-yellow-500 text-white px-4 py-1 rounded-full hover:bg-gray-900 transition text-sm"
                onClick={handleCoverUpload}
              >
                Confirm Cover Photo
              </button>
            )}
          </div>
        )}

        <div className="pt-12 px-6">
          <div className="text-2xl font-semibold">{profile.profilename}</div>
          <div className="text-gray-600">@{profile.username}</div>
          {profile.bio && (
            <div className="text-md text-gray-900 mt-2">{profile.bio}</div>
          )}

          <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
            <FaRegCalendarAlt className="text-yellow-400 text-xl" />
            Joined on {formattedDate}
          </div>

          {profile.dob && (
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FaBirthdayCake className="text-yellow-400 text-xl" />
              Born on{" "}
              {new Date(profile.dob).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </div>
          )}

          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">
                {profile.following ? profile.following.length : 0}
              </span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-black">
                {profile.followers ? profile.followers.length : 0}
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
          profile.posts &&
          [...profile.posts]
            .reverse()
            .map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}

        {activeTab === "likes" &&
          profile.likedPosts &&
          [...profile.likedPosts]
            .reverse()
            .map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}

        
      </div>
    </div>
  );
};

export default Profile;
