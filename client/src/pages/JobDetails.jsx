import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const JobDetails = ({ appliedJobIds, setAppliedJobIds }) => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) return toast.error("Please login to apply.");

    if (!job) {
      toast.error("Job data not loaded. Please try again.");
      return;
    }

    if (appliedJobIds?.includes(id)) {
      setApplying(false);
      return toast.error("You already applied for this job!");
    }

    setApplying(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const savedLink = userDoc.exists() ? userDoc.data().resumeLink : "";

      if (!savedLink) {
        toast.error("Add your LinkedIn link in profile first.");
        setApplying(false);
        return;
      }

      if (!job.title || !job.postedBy) {
        toast.error("Invalid job data. Please refresh and try again.");
        setApplying(false);
        return;
      }

      await addDoc(collection(db, "applications"), {
        jobId: id,
        jobTitle: job.title,
        applicantId: user.uid,
        applicantName: user.displayName,
        resumeLink: savedLink,
        employerId: job.postedBy,
        appliedAt: new Date().toISOString(),
      });

      if (setAppliedJobIds) {
        setAppliedJobIds((prev) => [...prev, id]);
      }

      toast.success("Applied successfully!");
    } catch (err) {
      console.error("Apply Error:", err);
      toast.error("Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
      </div>
    );

  if (!job) return <div className="text-center py-20">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        {/* Compact Header */}
        <div className="flex items-start gap-5 border-b border-slate-50 pb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0">
            {job.company?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight mb-1">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              {job.company} <span className="text-slate-300 mx-2">•</span>{" "}
              {job.location}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-8">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
            Job Description
          </h3>
          <div className="text-slate-600 leading-relaxed text-sm font-medium whitespace-pre-line break-words overflow-wrap-anywhere">
            {job.description}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <button
            onClick={handleApply}
            disabled={applying}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
              applying
                ? "bg-slate-100 text-slate-400"
                : "bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200"
            }`}
          >
            {applying ? "Applying..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
