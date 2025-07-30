import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center px-4">
      <div className="max-w-lg bg-white rounded-xl shadow-lg p-10 border border-yellow-200">
        <h1 className="text-7xl font-bold text-yellow-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition"
        >
          <BsArrowLeft className="text-lg" />
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
