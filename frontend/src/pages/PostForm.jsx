import { FaTimes, FaImage } from 'react-icons/fa';
import { useSideBar } from '../contexts/SideBarContext';
import { useState } from 'react';
import axios from 'axios';
import Success from '../components/Success';
import Error from '../components/Error';

const PostForm = () => {
  const { previous, setPrevious, setTab } = useSideBar();
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const username = JSON.parse(localStorage.getItem("auth"))?.user?.username;

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !username) return;

    const formData = new FormData();
    formData.append('description', description);
    formData.append('visibility', visibility);
    formData.append('username', username);
    if (image) formData.append('media', image);

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:4000/api/post/create-post', formData);
      if (res.status === 201) {
        console.log("✅ Post created:", res.data.savedPost);
        setDescription('');
        setVisibility('public');
        setImage(null);
        setPreview(null);
        setTab(previous);
        setPrevious('');
        showSuccess('Post created successfully!');
      } else {
        showError('Unexpected response from server.');
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || 'Something went wrong while posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[200px] w-[600px] bg-white border-2 rounded-lg border-yellow-400 p-5 shadow-md">
      {successMessage && <Success message={successMessage} />}
      {errorMessage && <Error message={errorMessage} />}

      <div className="flex justify-end mb-2">
        <button
          className="text-gray-500 hover:text-black transition text-xl"
          onClick={() => {
            setTab(previous);
            setPrevious('');
          }}
        >
          <FaTimes />
        </button>
      </div>

      <div className="mb-4">
        <textarea
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-24 max-h-60 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none overflow-y-auto"
        />
      </div>

      <div className="mb-4">
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm text-gray-700"
        >
          <option value="public">Public</option>
          <option value="followers">Followers</option>
          <option value="private">Only Me</option>
        </select>
      </div>

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="max-h-40 rounded-md object-contain border" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-yellow-500 cursor-pointer hover:text-yellow-600 transition">
          <FaImage className="text-xl" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-white text-xl px-5 py-1 rounded-full transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostForm;
