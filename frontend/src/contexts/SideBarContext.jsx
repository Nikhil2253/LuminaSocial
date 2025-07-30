import { createContext, useContext, useState } from "react";

const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
  const [tab, setTab] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [previous,setPrevious]=useState("");
  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <SideBarContext.Provider value={{ tab, setTab, isOpen, setIsOpen, toggleSidebar,previous,setPrevious }}>
      {children}
    </SideBarContext.Provider>
  );
};

export const useSideBar = () => useContext(SideBarContext);