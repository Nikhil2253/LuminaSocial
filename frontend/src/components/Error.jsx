import { FiAlertCircle } from "react-icons/fi";

const Error = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 z-50 transform animate-slide-in flex items-center gap-3 px-6 py-3 bg-red-600 text-white text-sm md:text-base font-semibold rounded-lg shadow-lg">
      <FiAlertCircle className="text-white text-xl" />
      {message}
    </div>
  );
};

export default Error;
