import { useEffect, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db, auth } from "./firebase/config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { setJobs, selectFilteredJobs, setSearchQuery } from "./store/jobSlice";

import { onAuthStateChanged } from "firebase/auth";
import { loginSuccess, logoutSuccess } from "./store/authSlice";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import PostJob from "./components/PostJob";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/Home"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const MyJobs = lazy(() => import("./pages/MyJobs"));
const EditJob = lazy(() => import("./pages/EditJob"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const dispatch = useDispatch();

  const filteredJobs = useSelector(selectFilteredJobs);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeApps;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        dispatch(
          loginSuccess({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          }),
        );

        const q = query(
          collection(db, "applications"),
          where("applicantId", "==", currentUser.uid),
        );

        unsubscribeApps = onSnapshot(
          q,
          (snapshot) => {
            const ids = snapshot.docs.map((doc) => doc.data().jobId);
            setAppliedJobIds(ids);
          },
          (error) => {
            console.error("Firestore error:", error);
          },
        );
      } else {
        dispatch(logoutSuccess());
        setAppliedJobIds([]);
        if (unsubscribeApps) unsubscribeApps();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeApps) unsubscribeApps();
    };
  }, [dispatch]);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));

    const unsubscribeJobs = onSnapshot(
      q,
      (snapshot) => {
        const jobsArray = snapshot.docs.map((doc) => {
          const data = doc.data();

          const convertTimestamp = (timestamp) => {
            if (timestamp && typeof timestamp.toDate === "function") {
              return timestamp.toDate().toISOString();
            } else if (timestamp instanceof Date) {
              return timestamp.toISOString();
            } else if (typeof timestamp === "string") {
              return timestamp;
            }
            return new Date().toISOString();
          };

          const serializedData = {
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };

          return {
            id: doc.id,
            ...serializedData,
          };
        });

        dispatch(setJobs(jobsArray));
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribeJobs();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(searchTerm));
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const ProtectedRoute = ({ user, children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] relative overflow-hidden font-sans text-slate-900">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px]"></div>
      </div>

      <Toaster position="top-center" />

      <Navbar />

      <main className="relative z-10">
        <ErrorBoundary>
          <Suspense
            fallback={
              <LoadingSpinner
                size="large"
                message="Loading..."
                className="min-h-[60vh]"
              />
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loading={loading}
                    filteredJobs={filteredJobs}
                    appliedJobIds={appliedJobIds}
                  />
                }
              />

              <Route
                path="/job/:id"
                element={
                  <JobDetails
                    appliedJobIds={appliedJobIds}
                    setAppliedJobIds={setAppliedJobIds}
                  />
                }
              />

              <Route
                path="/post-job"
                element={
                  <ProtectedRoute user={user}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-jobs"
                element={
                  <ProtectedRoute user={user}>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-job/:id"
                element={
                  <ProtectedRoute user={user}>
                    <EditJob />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute user={user}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
