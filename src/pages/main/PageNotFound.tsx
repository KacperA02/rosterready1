import {FC} from "react";
import { Link } from "react-router-dom";

const PageNotFound: FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div>
        <h1 className="text-5xl font-bold text-gray-700">404</h1>
        <p className="text-xl text-gray-500 mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue font-semibold rounded-md hover:bg-blue-700 text-gray "
        >
          Go Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
