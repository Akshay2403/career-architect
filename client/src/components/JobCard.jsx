import { Link } from "react-router-dom";
import Button from "./Button";

const JobCard = ({ job, isApplied }) => {
  if (!job || typeof job !== "object") {
    return (
      <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-slate-400 text-center">Job data unavailable</p>
      </div>
    );
  }

  const companyInitial = job.company?.charAt?.(0)?.toUpperCase() || "?";
  const jobTitle = job.title || "Untitled Position";
  const jobCompany = job.company || "Unknown Company";
  const jobLocation = job.location || "Remote";
  const jobDescription = job.description || "No description provided";

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      {isApplied && (
        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-xl text-[9px] font-black uppercase tracking-widest z-10">
          Applied
        </div>
      )}

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-sm font-bold text-indigo-600 border border-slate-100">
            {companyInitial}
          </div>
          <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md uppercase tracking-tight">
            {jobLocation}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-0.5 line-clamp-1">
          {jobTitle}
        </h3>

        <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-wider mb-4">
          {jobCompany}
        </p>

        <p className="text-slate-500 text-[12px] line-clamp-2 min-h-[40px] mb-6 leading-relaxed font-medium">
          {jobDescription}
        </p>
      </div>

      <div className="mt-auto">
        <Link to={job.id ? `/job/${job.id}` : "#"}>
          <Button variant="primary" size="small" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
