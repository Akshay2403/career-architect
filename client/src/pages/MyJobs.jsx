import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("postedBy", "==", user.uid),
        );
        const jobsSnap = await getDocs(jobsQuery);
        setMyJobs(
          jobsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [],
        );

        const appsQuery = query(
          collection(db, "applications"),
          where("employerId", "==", user.uid),
        );
        const appsSnap = await getDocs(appsQuery);
        setApplications(
          appsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [],
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.code !== "permission-denied") {
          toast.error("Failed to load dashboard data. Please refresh.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleDelete = async (jobId) => {
    if (window.confirm("Do you really want to delete???")) {
      try {
        const applicationsQuery = query(
          collection(db, "applications"),
          where("jobId", "==", jobId),
        );
        const applicationsSnap = await getDocs(applicationsQuery);

        const deletePromises = applicationsSnap.docs.map((appDoc) =>
          deleteDoc(doc(db, "applications", appDoc.id)),
        );

        await Promise.all(deletePromises);

        await deleteDoc(doc(db, "jobs", jobId));

        setMyJobs(myJobs.filter((j) => j.id !== jobId));
        setApplications(applications.filter((app) => app.jobId !== jobId));

        toast.success("Job and all its applications have been deleted...");
      } catch (err) {
        console.error("Error deleting job:", err);
        toast.error("Failed to delete job. Please try again.");
      }
    }
  };

  if (!user) {
    return (
      <Container className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Login Required
          </h2>
          <p className="text-slate-600 mb-6">
            Please login to view and manage your jobs.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="primary"
            size="medium"
          >
            Go to Home
          </Button>
        </div>
      </Container>
    );
  }

  if (loading)
    return (
      <Container className="py-20">
        <LoadingSpinner size="medium" />
      </Container>
    );

  return (
    <Container className="py-12">
      <PageHeader
        title={
          <>
            Employer <span className="text-indigo-600">Console</span>
          </>
        }
        subtitle="Manage Postings & Talent"
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-16">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Active Listings ({myJobs.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50">
              <tr>
                <th className="p-5">Job Title</th>
                <th className="p-5">Company</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myJobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-indigo-50/20 transition-colors"
                >
                  <td className="p-5 font-bold text-slate-700 text-sm truncate max-w-[200px]">
                    {job.title}
                  </td>
                  <td className="p-5 text-slate-500 text-sm font-medium">
                    {job.company}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-5">
                      <Link
                        to={`/edit-job/${job.id}`}
                        className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myJobs.length === 0 && (
            <EmptyState
              title="No jobs posted yet, Bhai."
              variant="compact"
              className="p-10"
            />
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">
          Recent <span className="text-indigo-600">Applications</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-600 translate-x-full group-hover:translate-x-0 transition-transform"></div>

              <h3 className="font-black text-base text-slate-900 mb-0.5 truncate uppercase tracking-tight">
                {app.applicantName}
              </h3>
              <p className="text-indigo-600 font-bold text-[9px] uppercase tracking-widest mb-4 truncate">
                For: {app.jobTitle}
              </p>

              <div className="space-y-1.5 mb-6">
                <p className="text-slate-500 text-[11px] font-semibold truncate">
                  📧 {app.applicantEmail}
                </p>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">
                  📅 {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <a
                href={app.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-sm"
              >
                View Profile →
              </a>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <EmptyState title="Nobody has applied yet." variant="compact" />
        )}
      </div>
    </Container>
  );
};

export default MyJobs;
