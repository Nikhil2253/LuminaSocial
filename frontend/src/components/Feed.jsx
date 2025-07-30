import axios from "axios";
import { useEffect, useState } from "react";
import BookPostCard from "./BookPostCard";
import { FiRefreshCcw } from "react-icons/fi";

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/post/feed");
        setFeedPosts(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    getFeed();
  }, []);

  useEffect(()=>{
   console.log(feedPosts)
  },[feedPosts]); 
  return (
    <div className="h-screen overflow-y-auto bg-white text-black border-x border-yellow-300 w-full">
      <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-yellow-300 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="text-xl font-bold text-black ">HOME</h2>
        <button
          onClick={getFeed}
          disabled={loading}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-yellow-400 text-yellow-400 hover:text-yellow-500 hover:border-yellow-500 transition duration-300"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiRefreshCcw size={20} />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : feedPosts.length > 0 ? (
        feedPosts.map((post, i) => (
          <BookPostCard key={post._id} post={post} index={i} />
        ))
      ) : (
        <div className="text-gray-500 text-center mt-10">No posts to show.</div>
      )}
    </div>
  );
};

export default Feed;
