import { useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const handleGenerateMagic = async () => {
    if (!formData.title || !formData.location) {
      return toast.error("Please provide Job Title and Location first.");
    }

    setLoading(true);
    const toastId = toast.loading("Generating with AI...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            location: formData.location,
          }),
        },
      );

      const data = await res.json();

      if (data?.generated && !data.generated.toLowerCase().includes("nahi")) {
        setFormData((prev) => ({
          ...prev,
          description: data.generated,
        }));

        toast.success("AI description generated 🚀", { id: toastId });
      } else {
        throw new Error("AI returned empty");
      }
    } catch (err) {
      console.error("AI failed:", err);

      const fallback = `We are looking for a skilled ${formData.title} to join our team in ${formData.location}. The candidate will work on real-world projects, collaborate with teams, and deliver high-quality solutions.`;

      setFormData((prev) => ({
        ...prev,
        description: fallback,
      }));

      toast.error("AI failed ❌ — basic description used instead", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("Please login to post a job.");
      return;
    }

    if (loading) {
      return;
    }

    if (
      !formData.title?.trim() ||
      !formData.company?.trim() ||
      !formData.location?.trim() ||
      !formData.description?.trim()
    ) {
      return toast.error("Please fill all the fields.");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        postedBy: auth.currentUser.uid,
        employerEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
      });
      navigate("/my-jobs");
    } catch (error) {
      console.error(error);
      if (error.code === "permission-denied") {
        toast.error("You don't have permission to post jobs.");
      } else {
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create <span className="text-indigo-600">Opportunity</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
            Fill in the details to find your next great hire.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Job Title
              </label>
              <input
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Company Name
              </label>
              <input
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                placeholder="e.g. Career Architect"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Location
            </label>
            <input
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
              placeholder="e.g. Remote / New Delhi"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Job Description
            </label>
            <textarea
              className="w-full px-5 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[200px] text-sm font-medium leading-relaxed resize-none"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateMagic}
              className="absolute bottom-6 right-6 bg-white border border-indigo-100 text-indigo-600 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Writing..." : "✨ Smart Suggest"}
            </button>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? "Publishing..." : "Publish Job Posting →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
