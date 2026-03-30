import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase/config";
import { signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { logoutSuccess, loginSuccess } from "../store/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(
        loginSuccess({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      );
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Login failed!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutSuccess());
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-lg font-black text-slate-900 uppercase tracking-tighter"
        >
          Career<span className="text-indigo-600">Architect</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6 font-bold text-slate-600 text-[11px] tracking-[0.15em]">
          <Link
            to="/"
            className="hover:text-indigo-600 uppercase transition-colors"
          >
            Browse
          </Link>

          {user ? (
            <>
              <Link
                to="/post-job"
                className="hover:text-indigo-600 uppercase transition-colors"
              >
                Post Job
              </Link>
              <Link
                to="/my-jobs"
                className="hover:text-indigo-600 uppercase transition-colors"
              >
                My Jobs
              </Link>

              <button
                onClick={handleLogout}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-red-500 transition-all uppercase tracking-widest"
              >
                Logout
              </button>

              <Link
                to="/profile"
                className="flex items-center ml-2 transition-transform active:scale-90"
              >
                <img
                  src={user.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm object-cover"
                  // Ye line add karein
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.displayName}`;
                  }}
                />
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black hover:bg-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100"
            >
              Sign In with Gmail
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
