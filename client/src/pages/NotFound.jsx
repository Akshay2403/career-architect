import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center py-40 min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-black text-slate-200 tracking-tighter">
        404
      </h1>

      <p className="text-2xl font-bold text-slate-600 -mt-10 mb-8 relative z-10">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
      >
        Return to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
