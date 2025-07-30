import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSideBar } from "../contexts/SideBarContext";
import { FaArrowLeft } from "react-icons/fa";
import BookPostCard from "./BookPostCard";

const BookMarks = () => {
  const { user } = useAuth();
  const { setTab } = useSideBar();
  const navigate = useNavigate();
  const [bookMarks, setBookMarks] = useState([]);

  useEffect(() => {
    const getBookMarks = async () => {
      try {
        if (!user?.id) return;
        const response = await axios.get(
          `http://localhost:4000/api/post/bookmark/${user.id}`
        );
        setBookMarks(response.data.bookMarks);
      } catch (error) {
        console.log(error);
      }
    };
    getBookMarks();
  }, [user]);

  useEffect(()=>{ 
      console.log(bookMarks)
  },[bookMarks]);
  const ReturnToHome = () => {
    setTab("Home");
    navigate("/");
  };

  return (
    <div className="relative h-screen overflow-y-auto bg-white text-black">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-300 flex items-center px-4 py-5">
        <FaArrowLeft
          onClick={ReturnToHome}
          className="text-xl text-gray-800 cursor-pointer mr-4 hover:text-yellow-500"
        />
        <h2 className="text-xl font-semibold">Bookmarks</h2>
      </div>

      <div className="p-4">
        {bookMarks.length > 0 ? (
          bookMarks.map((post, i) => (
            <BookPostCard key={post._id} post={post} index={i} />
          ))
        ) : (
          <div className="text-gray-500 text-center mt-10">No bookmarks found.</div>
        )}
      </div>
    </div>
  );
};

export default BookMarks;
