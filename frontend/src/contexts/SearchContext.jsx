import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [trending, setTrending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/tags/");
        const sorted = res.data
          .sort((a, b) => b.count - a.count)
          .slice(0, 30)
          .map((tag, index) => ({
            id: index + 1,
            tag: `#${tag.value}`,
            count: `${tag.count} posts`,
          }));
        setTrending(sorted);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user/getAll");
        setAllUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchTags();
    fetchAllUsers();
  }, []);

  return (
    <SearchContext.Provider value={{ trending, allUsers,setTrending }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
