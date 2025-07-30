import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
  FaRegComment,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FiShare, FiEdit2, FiCopy, FiUserX, FiXCircle } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete, MdOutlineReport } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const PostCard = ({ post }) => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const createdAt = new Date(post.createdAt).toLocaleString();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [openOption, setOpenOption] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState(post.description);

  useEffect(() => {
    if (post.user) {
      setIsOwner(user.username === post.user.username);
    }
  }, [post, user]);

  const handleOptionToggle = () => {
    setOpenOption((prev) => !prev);
  };

  const handleProfileClick = () => {
    if (user.username === post.user.username) navigate(`/i/${user.username}`);
    else navigate(`/u/${post.user.username}`);
  };

  useEffect(() => {
    const checkIsLiked = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/post/isLiked", {
          params: { userId: user.id, postId: post._id },
        });
        setIsLiked(res.data.isLiked);
      } catch (err) {
        console.error("Error checking isLiked:", err);
      }
    };
    checkIsLiked();
  }, [post._id, user.id]);

  useEffect(() => {
    const checkIsBookmarked = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/post/isBookMark",
          {
            params: { userId: user.id, postId: post._id },
          }
        );
        setIsBookmarked(res.data.isBookmarked);
      } catch (err) {
        console.error("Error checking isBookmarked:", err);
      }
    };
    checkIsBookmarked();
  }, [post._id, user.id]);

  const handleLikeToggle = async () => {
    try {
      if (!isLiked) {
        await axios.post("http://localhost:4000/api/post/like", {
          userId: user.id,
          postId: post._id,
        });
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      } else {
        await axios.post("http://localhost:4000/api/post/unlike", {
          userId: user.id,
          postId: post._id,
        });
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      if (!isBookmarked) {
        await axios.post("http://localhost:4000/api/post/bookMark", {
          userId: user.id,
          postId: post._id,
        });
        setIsBookmarked(true);
      } else {
        await axios.post("http://localhost:4000/api/post/unbookMark", {
          userId: user.id,
          postId: post._id,
        });
        setIsBookmarked(false);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  const handleCommentToggle = () => {
    setIsComment((prev) => !prev);
  };

  const handleCommentType = (e) => {
    setComment(e.target.value);
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post("http://localhost:4000/api/post/comment", {
        userId: user.id,
        postId: post._id,
        text: comment,
      });
      setComment("");
      setIsComment(false);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const editPost = () => {
    setOpenOption(false);
    setIsEditing(true);
  };

  const confirmEdit = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/post/edit", {
        id: post._id,
        description: editedDesc,
      });
      console.log("Edited:", response.data);
      setIsEditing(false);
      alert("Post updated");
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deletePost();
  };

  const deletePost = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/post/delete",
        {
          id: post._id,
        }
      );
      console.log("Deleted:", response.data);
      setOpenOption(false);
      alert("Deleted");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handlePostOpen = (e) => {
    e.preventDefault();
    console.log("Directing to : ", post._id, "Logged in : ", isLoggedIn);
    navigate(`/posts/${post._id}`);
  };

  const copyToClipboard = async (text) => {
    try {
      setOpenOption(false);
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Failed to copy link.");
    }
  };

  if (post.user == null) return <div></div>;
  return (
    <div className="border-b border-orange-300 bg-white px-4 py-6 w-full max-w-2xl mx-auto mb-2.5 relative">
      <div className="flex justify-between items-start mb-3">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          {post.user.profilePic !== "" ? (
            <img
              src={`http://localhost:4000${post.user.profilePic}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-yellow-400" />
          )}
          <div>
            <div className="font-semibold text-gray-900">
              {post.user.profilename}
            </div>
            <div className="text-sm text-gray-500">
              @{post.user.username} · {createdAt}
            </div>
          </div>
        </div>

        <div className="relative">
          <BsThreeDots
            onClick={handleOptionToggle}
            className="text-gray-600 cursor-pointer hover:text-yellow-600"
          />
          {openOption && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md w-48 z-50 text-sm overflow-hidden">
              {isOwner ? (
                <>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                    onClick={editPost}
                  >
                    <FiEdit2 size={16} /> Edit Post
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 cursor-pointer text-red-600"
                    onClick={handleDelete}
                  >
                    <MdDelete size={18} /> Delete Post
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/posts/${post._id}`
                      )
                    }
                  >
                    <FiCopy size={16} /> Copy Link
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/posts/${post._id}`
                      )
                    }
                  >
                    <FiCopy size={16} /> Copy Link
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full border border-yellow-300 p-2 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmEdit}
              className="text-sm px-3 py-1 rounded-md bg-yellow-400 text-white hover:bg-yellow-500"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <p
          className="text-gray-800 text-[17px] mb-3 whitespace-pre-line"
          onClick={handlePostOpen}
        >
          {post.description}
        </p>
      )}

      {post.media?.length > 0 &&
        post.media.map((media, i) => (
          <div key={i} className="mb-3">
            {media.type === "image" ? (
              <img
                src={`http://localhost:4000${media.url}`}
                alt={`media-${i}`}
                className="rounded-md border max-h-[400px] w-full object-cover"
              />
            ) : media.type === "video" ? (
              <video
                src={`http://localhost:4000${media.url}`}
                controls
                className="rounded-md border max-h-[400px] w-full object-contain"
              />
            ) : null}
          </div>
        ))}

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 text-[17px] text-[#ff8800] font-medium mb-2">
          {post.tags.map((tag, i) => (
            <span key={i}>#{tag}</span>
          ))}
        </div>
      )}

      <div className="flex justify-evenly gap-6 text-gray-500 pt-2 max-w-full">
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            isLiked ? "text-orange-400" : "hover:text-yellow-400"
          }`}
          onClick={handleLikeToggle}
        >
          {isLiked ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
          <span className="text-sm">{likeCount}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:text-yellow-400"
          onClick={handleCommentToggle}
        >
          <FaRegComment size={22} />
          <span className="text-sm">
            {post.comments ? post.comments.length : 0}
          </span>
        </div>

        <div
          className={`flex items-center gap-2 cursor-pointer ${
            isBookmarked ? "text-orange-400" : "hover:text-yellow-400"
          }`}
          onClick={handleBookmarkToggle}
        >
          {isBookmarked ? (
            <FaBookmark size={22} />
          ) : (
            <FaRegBookmark size={22} />
          )}
          <span className="text-sm">{isBookmarked ? "Saved" : "Save"}</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:text-yellow-400"
          onClick={() => {
            const url = `${window.location.origin}/posts/${post._id}`;
            if (navigator.share) {
              navigator
                .share({
                  title: "Check out this post!",
                  url,
                })
                .catch((err) => console.error("Share failed:", err));
            } else {
              copyToClipboard(url);
            }
          }}
        >
          <FiShare size={22} />
          <span className="text-sm">Share</span>
        </div>
      </div>

      {isComment && (
        <div className="mt-3 relative">
          <input
            type="text"
            value={comment}
            onChange={handleCommentType}
            placeholder="Post your reply"
            className="w-full bg-gray-100 text-sm px-4 py-3 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-300 placeholder-gray-500"
          />
          <button
            onClick={handleComment}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600"
          >
            <IoSend size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
