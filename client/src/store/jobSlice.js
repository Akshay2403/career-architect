import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
  searchQuery: "",
  isLoading: false,
};

export const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.allJobs = action.payload;
      state.isLoading = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const selectFilteredJobs = createSelector(
  [(state) => state.jobs.allJobs, (state) => state.jobs.searchQuery],
  (allJobs, searchQuery) => {
    return allJobs.filter((job) =>
      [job.title, job.company, job.location].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  },
);

export const { setJobs, setSearchQuery, setLoading } = jobSlice.actions;
export default jobSlice.reducer;
