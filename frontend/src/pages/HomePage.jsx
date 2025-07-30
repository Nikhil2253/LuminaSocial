import SideBar from "../components/SideBar";
import Feed from "../components/Feed";
import Panel from "../components/Panel";
import PostForm from "./PostForm";
import { useSideBar } from "../contexts/SideBarContext";
import BookMarks from "../components/BookMarks";
import Settings from "../components/Settings";
import Messaging from "../chat/Messaging";
import { MessageProvider } from "../contexts/MessageContext";
import SearchPage from "../components/SearchPage";
import { SearchProvider } from "../contexts/SearchContext.jsx";

const HomePage = () => {
  const { tab } = useSideBar();
  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-0 bottom-0 left-0 w-[20%] bg-white border-r border-yellow-200">
        <SideBar />
      </div>

      <div className="absolute top-0 bottom-0 left-[20%] w-[50%] bg-yellow-200 overflow-y-auto custom-scrollbar">
        {tab === "Home" && <Feed />}
        {tab === "Bookmarks" && <BookMarks />}
      </div>
      {tab === "Settings" && (
        <div className="absolute top-0 bottom-0 left-[20%] w-[80%] bg-white overflow-y-auto custom-scrollbar">
          <Settings />
        </div>
      )}
      {tab === "Messaging" && (
        <div className="absolute top-0 bottom-0 left-[20%] w-[80%] bg-white overflow-y-auto custom-scrollbar">
          <MessageProvider>
            <Messaging />
          </MessageProvider>
        </div>
      )}

      {tab === "Search" && (
        <div className="absolute top-0 bottom-0 left-[20%] w-[80%] bg-white overflow-y-auto custom-scrollbar">
          <SearchProvider>
            <SearchPage />
          </SearchProvider>
        </div>
      )}

      {tab !== "Settings" && tab !== "Messaging" && tab !== "Search" && (
        <div className="absolute top-0 bottom-0 left-[70%] w-[30%] bg-white border-l border-yellow-200">
          <SearchProvider>
            <Panel />
          </SearchProvider>
        </div>
      )}

      {tab === "Post" && (
        <div className="absolute inset-0 z-50 bg-white/70 flex justify-center items-start pt-4">
          <PostForm />
        </div>
      )}
    </div>
  );
};

export default HomePage;
