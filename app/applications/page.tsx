"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import ApplicationsTable from "./application-list";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/interface/types/applicationTypes"; // adjust path
const ApplicationsPage = () => {
  // Filters & search
  const [jobId, setJobId] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);

  return (
    <MainLayout>
      <div className="p-6 bg-white shadow-md rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Applications List</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Candidate ID"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">All Status</option>
            {Object.values(ApplicationStatus).map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}{" "}
                {/* Optional: nicer display */}
              </option>
            ))}
          </select>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Just trigger table refresh by changing a key or useEffect in table
              // Optional: we could add a state that forces table to reload
            }}
          >
            Refresh
          </Button>
        </div>

        {/* Applications Table */}
        <ApplicationsTable
          job_id={jobId}
          candidate_id={candidateId}
          status={status}
          limit={limit}
        />
      </div>
    </MainLayout>
  );
};

export default ApplicationsPage;
