import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Container from "../components/Container";

const Home = ({
  searchTerm,
  setSearchTerm,
  loading,
  filteredJobs,
  appliedJobIds,
}) => {
  return (
    <Container size="large" className="pt-16 pb-20">
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
          Find your next <span className="text-indigo-600">career move.</span>
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto mb-8 font-medium">
          Browse through high-quality opportunities curated for top-tier
          developers.
        </p>

        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <span className="text-slate-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search by role or company..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold text-slate-700 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner
          size="large"
          message="Loading jobs..."
          className="h-[60vh]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="h-full">
                <JobCard
                  job={job}
                  isApplied={appliedJobIds?.includes(job.id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon="🔍"
                title="No jobs found"
                message="Try adjusting your search"
                variant="search"
                className="py-20"
              />
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default Home;
