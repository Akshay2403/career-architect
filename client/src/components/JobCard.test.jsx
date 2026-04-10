import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import JobCard from "./JobCard";

describe("JobCard Component", () => {
  const mockJob = {
    id: "123",
    title: "React Developer",
    company: "TechCorp",
    location: "Mumbai",
    description: "We need a React expert",
  };

  test("renders job title, company and location correctly", () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} isApplied={false} />
      </BrowserRouter>,
    );

    expect(screen.getByText("React Developer")).toBeInTheDocument();
    expect(screen.getByText("TechCorp")).toBeInTheDocument();
    expect(screen.getByText(/Mumbai/)).toBeInTheDocument();
  });

  test('shows "Applied" badge when isApplied is true', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} isApplied={true} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  test('does not show "Applied" badge when isApplied is false', () => {
    render(
      <BrowserRouter>
        <JobCard job={mockJob} isApplied={false} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Applied")).not.toBeInTheDocument();
  });
});
