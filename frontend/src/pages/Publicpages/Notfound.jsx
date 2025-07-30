import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-lg w-full transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-blue-600 animate-bounce" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4 animate-pulse">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 text-sm font-medium">
          Oops! It looks like the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;