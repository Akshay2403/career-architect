import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobCount, setJobCount] = useState(0);
  const [resumeLink, setResumeLink] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const q = query(
          collection(db, "jobs"),
          where("postedBy", "==", user.uid),
        );
        const snapshot = await getDocs(q);
        setJobCount(snapshot.size);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setResumeLink(userDoc.data().resumeLink || "");
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const handleSaveLink = async () => {
    const urlRegex =
      /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\.[a-z]{2,})?(\/.*)?$/i;
    const trimmedLink = resumeLink.trim();

    if (!trimmedLink) {
      return toast.error("Please enter a URL link...");
    }

    if (!trimmedLink.includes("http")) {
      return toast.error(
        "Please enter a valid URL (must start with http:// or https://)...",
      );
    }

    if (!urlRegex.test(trimmedLink)) {
      return toast.error("Please enter a valid URL format...");
    }

    if (trimmedLink.length > 500) {
      return toast.error("URL is too long (max 500 characters)...");
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          resumeLink: trimmedLink,
          email: user.email,
          displayName: user.displayName,
        },
        { merge: true },
      );
      toast.success("Link has been saved successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "permission-denied") {
        toast.error("You don't have permission to save links.");
      } else {
        toast.error("Failed to save link. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Login Required
          </h2>
          <p className="text-slate-600 mb-6">
            Please login to view and manage your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-900 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="relative z-10">
          <img
            src={user.photoURL}
            className="w-24 h-24 rounded-3xl border-4 border-white mx-auto mb-4 shadow-xl object-cover"
            alt="User"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {user.displayName}
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            {user.email}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-50">
            <h3 className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">
              Jobs Posted
            </h3>
            <p className="text-3xl font-black text-slate-900">{jobCount}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">
              Account Type
            </h3>
            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
              Verified Professional
            </p>
          </div>
        </div>

        <div className="mt-10 p-8 bg-slate-900 rounded-[2rem] text-left shadow-2xl shadow-indigo-100 relative z-10">
          <h4 className="text-white text-sm font-black uppercase tracking-widest mb-4">
            Resume / LinkedIn Profile
          </h4>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              className="flex-1 px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-medium outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />
            <button
              onClick={handleSaveLink}
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              {saving ? "Saving..." : "Save Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
