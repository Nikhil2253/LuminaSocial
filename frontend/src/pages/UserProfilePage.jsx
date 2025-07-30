import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import Panel from "../components/Panel";
import UserProfile from "../components/UserProfile";
import { useSideBar } from "../contexts/SideBarContext";
import PostForm from "./PostForm";
import { SearchProvider } from "../contexts/SearchContext";

const UserProfilePage = () => {
  const { id } = useParams();
  const { tab } = useSideBar();

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-0 bottom-0 left-0 w-[20%] bg-white border-r border-yellow-200">
        <SideBar />
      </div>

      <div className="absolute top-0 bottom-0 left-[20%] w-[50%] bg-yellow-200 overflow-y-auto custom-scrollbar">
        <UserProfile username={id} />
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

export default UserProfilePage;
