import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { FiEdit3 } from "react-icons/fi";

const EditProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user?.id) {
          const res = await axios.get(`http://localhost:4000/api/user/getUser/${user.id}`);
          setUserData(res.data);
          setFormData(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/user/update/${user.id}`, formData);
      setUserData(formData);
      setEditMode(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (!userData) return <div>Loading user data...</div>;

  const displayOrNA = (value) => value?.trim?.() || "N/A";

  return (
    <div className="bg-yellow-50 p-10 relative rounded shadow w-full  mt-6 border border-yellow-400">
      <div className="absolute top-4 right-4">
        {editMode ? (
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
            <button onClick={handleCancel} className="bg-red-600 text-white px-3 py-1 rounded">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-yellow-400 text-white px-3 py-1 rounded flex items-center gap-1">
            <FiEdit3 className="text-white" /> Edit
          </button>
        )}
      </div>

      <div className="mt-4 border border-orange-300 bg-white rounded-md p-3">
        <label className="block font-semibold">Profile Name</label>
        {editMode ? (
          <input
            name="profilename"
            value={formData.profilename}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        ) : (
          <div className="mt-1 text-gray-800">{displayOrNA(userData.profilename)}</div>
        )}
      </div>

      <div className="mt-4 border border-orange-300 bg-white rounded-md p-3">
        <label className="block font-semibold">Email</label>
        {editMode ? (
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        ) : (
          <div className="mt-1 text-gray-800">{displayOrNA(userData.email)}</div>
        )}
      </div>

      <div className="mt-4 border border-orange-300 bg-white rounded-md p-3">
        <label className="block font-semibold">Bio</label>
        {editMode ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 resize-none"
          />
        ) : (
          <div className="mt-1 text-gray-800">{displayOrNA(userData.bio)}</div>
        )}
      </div>

      <div className="mt-4 border border-orange-300 bg-white rounded-md p-3">
        <label className="block font-semibold">Date of Birth</label>
        {editMode ? (
          <input
            type="date"
            name="dob"
            value={formData.dob?.slice(0, 10) || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        ) : (
          <div className="mt-1 text-gray-800">{userData.dob ? userData.dob.slice(0, 10) : "N/A"}</div>
        )}
      </div>

      <div className="mt-4 border border-orange-300 bg-white rounded-md p-3">
        <label className="block font-semibold">Gender</label>
        {editMode ? (
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        ) : (
          <div className="mt-1 text-gray-800 capitalize">{displayOrNA(userData.gender)}</div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
