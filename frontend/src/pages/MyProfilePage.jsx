import SideBar from "../components/SideBar";
import Profile from "../components/Profile";
import Panel from "../components/Panel";
import PostForm from "./PostForm";
import { useSideBar } from "../contexts/SideBarContext";
import { SearchProvider } from "../contexts/SearchContext";

const MyProfilePage = () => {
  const { tab } = useSideBar();

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-0 bottom-0 left-0 w-[20%] bg-white border-r border-yellow-200">
        <SideBar />
      </div>

      <div className="absolute top-0 bottom-0 left-[20%] w-[50%] bg-yellow-200 overflow-y-auto custom-scrollbar">
        <Profile />
      </div>

      <div className="absolute top-0 bottom-0 left-[70%] w-[30%] bg-white border-l border-yellow-200">
        <SearchProvider>
          <Panel />
        </SearchProvider>
      </div>

      {tab === "Post" && (
        <div className="absolute inset-0 z-50 bg-white/70 flex justify-center items-start pt-4">
          <PostForm />
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
