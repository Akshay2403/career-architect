import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [jobOwner, setJobOwner] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        toast.error("Invalid job ID");
        navigate("/my-jobs");
        return;
      }

      setLoading(true);
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const jobInfo = docSnap.data();
          setJobOwner(jobInfo.postedBy);

          if (jobInfo.postedBy !== user?.uid) {
            toast.error("You don't have permission to edit this job");
            navigate("/my-jobs");
            return;
          }

          setJobData(jobInfo);
        } else {
          toast.error("Opportunity not found!");
          navigate("/my-jobs");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Error fetching job details.");
        navigate("/my-jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isSaving) {
      toast.error("Please wait, updating...");
      return;
    }

    if (
      !jobData.title?.trim() ||
      !jobData.company?.trim() ||
      !jobData.location?.trim() ||
      !jobData.description?.trim()
    ) {
      toast.error("All fields are required. Please fill them out.");
      return;
    }

    if (jobOwner !== user?.uid) {
      toast.error("You don't have permission to edit this job");
      navigate("/my-jobs");
      return;
    }

    setIsSaving(true);
    try {
      const jobRef = doc(db, "jobs", id);
      await updateDoc(jobRef, {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        updatedAt: serverTimestamp(),
      });

      toast.success("Job details updated successfully!");
      navigate("/my-jobs");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Failed to update job.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Edit <span className="text-indigo-600">Opportunity</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
            Update listing details
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
              value={jobData.title}
              onChange={(e) =>
                setJobData({ ...jobData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Google"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                value={jobData.company}
                onChange={(e) =>
                  setJobData({ ...jobData, company: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Remote or City"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                value={jobData.location}
                onChange={(e) =>
                  setJobData({ ...jobData, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Job Description
            </label>
            <textarea
              placeholder="Describe the role and requirements..."
              rows="5"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium resize-none"
              value={jobData.description}
              onChange={(e) =>
                setJobData({ ...jobData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-4 mt-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
              isSaving
                ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                : "bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200"
            }`}
          >
            {isSaving ? "Updating..." : "Save Changes →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
