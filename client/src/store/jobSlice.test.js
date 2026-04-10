import { describe, test, expect } from "vitest";
import { selectFilteredJobs } from "./jobSlice";

// Helper function to create a mock root state like Redux
const createMockRootState = (jobsState) => ({
  jobs: jobsState,
});

describe("jobSlice - selectFilteredJobs", () => {
  test("should filter jobs by search query (case-insensitive)", () => {
    const state = createMockRootState({
      allJobs: [
        {
          id: "1",
          title: "Frontend Developer",
          company: "Google",
          location: "Remote",
        },
        {
          id: "2",
          title: "Backend Engineer",
          company: "Amazon",
          location: "Bangalore",
        },
        {
          id: "3",
          title: "Full Stack",
          company: "Microsoft",
          location: "Hybrid",
        },
      ],
      searchQuery: "front",
      isLoading: false,
    });

    const filtered = selectFilteredJobs(state);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Frontend Developer");
  });

  test("should return all jobs when search query is empty", () => {
    const state = createMockRootState({
      allJobs: [
        { id: "1", title: "Frontend" },
        { id: "2", title: "Backend" },
      ],
      searchQuery: "",
      isLoading: false,
    });

    const filtered = selectFilteredJobs(state);
    expect(filtered).toHaveLength(2);
  });

  test("should return empty array if no match found", () => {
    const state = createMockRootState({
      allJobs: [
        { id: "1", title: "Frontend", company: "Google" },
        { id: "2", title: "Backend", company: "Amazon" },
      ],
      searchQuery: "xyzabc",
      isLoading: false,
    });

    const filtered = selectFilteredJobs(state);
    expect(filtered).toHaveLength(0);
  });
});
