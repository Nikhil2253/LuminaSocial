import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "./SideBar";
import Panel from "./Panel";
import {
  FaArrowLeft,
  FaUserCircle,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { IoSend } from "react-icons/io5";
import { MdEdit, MdDelete, MdContentCopy } from "react-icons/md";
import { useSideBar } from "../contexts/SideBarContext";
import { SearchProvider } from "../contexts/SearchContext";

const OpenedPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { setTab } = useSideBar();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/post/${id}`);
        setPost(res.data.data);
        setLikeCount(res.data.data.likes?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post) return;
    const checkInteractions = async () => {
      try {
        const likeRes = await axios.get(
          "http://localhost:4000/api/post/isLiked",
          {
            params: { userId: user.id, postId: post._id },
          }
        );
        setIsLiked(likeRes.data.isLiked);

        const bookmarkRes = await axios.get(
          "http://localhost:4000/api/post/isBookMark",
          {
            params: { userId: user.id, postId: post._id },
          }
        );
        setIsBookmarked(bookmarkRes.data.isBookmarked);
      } catch (err) {
        console.error("Interaction error:", err);
      }
    };
    checkInteractions();
  }, [post, user.id]);

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

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      setCommentLoading(true);
      const res = await axios.post("http://localhost:4000/api/post/comment", {
        userId: user.id,
        postId: post._id,
        text: commentText.trim(),
      });
      const newComment = {
        ...res.data.comment,
        user: {
          profilePic: user.profilePic,
          profileName: user.profilename,
          username: user.username,
        },
      };
      setPost((prev) => ({
        ...prev,
        comments: [newComment, ...prev.comments],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const ReturnToHome = () => {
    setTab("Home");
    navigate("/");
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
      setShowOptions(false);
      alert("Deleted");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleProfileClick = () => {
    if (user.username === post.user.username) navigate(`/i/${user.username}`);
    navigate(`/u/${post.user?.username}`);
  };

  if (loading)
    return <div className="text-center py-10 text-lg">Loading...</div>;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleEdit = () => {
    setEditedDesc(post.description);
    setIsEditing(true);
  };

  const handleEditConfirm = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/post/edit", {
        id: post._id,
        description: editedDesc,
      });
      setPost((prev) => ({ ...prev, description: editedDesc }));
      setIsEditing(false);
      setShowOptions(false);
      alert("Post updated");
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link.");
    }
  };

  return (
    <div className="flex h-screen text-[17px]">
      <div className="w-[300px] border-r border-yellow-200">
        <SideBar />
      </div>

      <div className="flex-1 overflow-y-auto border-x border-yellow-200 scroll-smooth">
        <div className="sticky top-0 bg-white z-10 border-b border-yellow-200 px-4 py-3 flex items-center gap-4">
          <FaArrowLeft
            className="text-xl cursor-pointer text-black"
            onClick={ReturnToHome}
          />
          <div className="font-semibold text-xl">Post</div>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 relative">
            <div
              onClick={handleProfileClick}
              className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-yellow-400 cursor-pointer"
            >
              {post.user?.profilePic ? (
                <img
                  src={`http://localhost:4000${post.user.profilePic}`}
                  className="h-full w-full object-cover"
                  alt=""
                />
              ) : (
                <FaUserCircle className="text-3xl" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center relative">
                <div onClick={handleProfileClick} className="cursor-pointer">
                  <div className="font-semibold text-black text-[18px]">
                    {post.user?.profilename}
                  </div>
                  <div className="text-base text-gray-500">
                    @{post.user?.username}
                  </div>
                </div>
                <BsThreeDots
                  className="text-gray-500 text-xl cursor-pointer"
                  onClick={() => setShowOptions((prev) => !prev)}
                />
                {showOptions && (
                  <div className="absolute top-3 right-10 mt-2 w-44 bg-white border border-gray-300 rounded shadow z-10">
                    {post.user._id === user.id ? (
                      <>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={handleEdit}
                        >
                          <MdEdit className="text-gray-600" /> Edit Post
                        </div>
                        <div
                          className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={handleDelete}
                        >
                          <MdDelete className="text-red-600" /> Delete Post
                        </div>
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/post/${post._id}`
                            )
                          }
                        >
                          <MdContentCopy className="text-gray-600" /> Copy Link
                        </div>
                      </>
                    ) : (
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/post/${post._id}`
                          )
                        }
                      >
                        <MdContentCopy className="text-gray-600" /> Copy Link
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-base text-gray-500 mt-1">
                {formattedDate}
              </div>

              {isEditing ? (
                <div className="mt-4">
                  <textarea
                    value={editedDesc}
                    onChange={(e) => setEditedDesc(e.target.value)}
                    className="w-full border border-yellow-300 p-3 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-1 rounded border text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditConfirm}
                      className="px-4 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 text-sm"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-black leading-7 whitespace-pre-wrap text-[17px]">
                  {post.description}
                </div>
              )}

              {post.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[15px] text-orange-500 font-bold px-3 py-[4px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {post.media?.length > 0 && (
                <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {post.media.map((item, i) =>
                    item.type === "image" ? (
                      <img
                        key={i}
                        src={`http://localhost:4000${item.url}`}
                        alt=""
                        className="rounded-xl border border-gray-300"
                      />
                    ) : (
                      <video
                        key={i}
                        src={`http://localhost:4000${item.url}`}
                        controls
                        className="rounded-xl border border-gray-300"
                      />
                    )
                  )}
                </div>
              )}

              <div className="flex justify-between mt-6 text-gray-600">
                <div
                  className={`flex items-center gap-2 cursor-pointer ${
                    isLiked ? "text-orange-400" : "hover:text-yellow-400"
                  }`}
                  onClick={handleLikeToggle}
                >
                  {isLiked ? <FaHeart size={22} /> : <FaRegHeart size={22} />}
                  <span>{likeCount}</span>
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
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </div>

                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-yellow-400"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Check out this post!",
                          url: `${window.location.origin}/post/${post._id}`,
                        })
                        .catch((err) => console.error("Share failed:", err));
                    } else {
                      copyToClipboard(
                        `${window.location.origin}/post/${post._id}`
                      );
                    }
                  }}
                >
                  <FiShare size={22} />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-8 border-t border-yellow-300 pt-6">
          <div className="text-xl font-medium text-gray-700 border-b pb-4 mb-8 border-yellow-100">
            {post.comments?.length || 0} Comment
            {post.comments?.length === 1 ? "" : "s"}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-yellow-300 rounded-sm px-4 py-2 text-[15px] outline-none"
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading}
                className="text-yellow-500 hover:text-orange-500"
              >
                <IoSend size={22} />
              </button>
            </div>
          </div>

          {post.comments?.length > 0 ? (
            post.comments.map((comment, i) => (
              <div key={i} className="flex gap-3 mb-6">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-yellow-400">
                  {comment.user?.profilePic ? (
                    <img
                      src={`http://localhost:4000${comment.user.profilePic}`}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  ) : (
                    <FaUserCircle className="text-2xl" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-black">
                        {comment.user?.profileName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{comment.user?.username}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 text-[15px] text-gray-800 leading-6">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No comments yet.</div>
          )}
        </div>
      </div>

      <div className="w-[400px] border-l border-yellow-200 hidden xl:block">
        <SearchProvider>
          <Panel />
        </SearchProvider>
      </div>
    </div>
  );
};

export default OpenedPost;
