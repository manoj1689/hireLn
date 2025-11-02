"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchApplications } from "@/lib/slices/applicant/getapplications-slice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Calendar, Share2, Trash2 } from "lucide-react";
import { ApplicationStatus } from "@/interface/candidate";
import InterviewScheduleModal from "../interviews/scheduleInterviewModal";

interface Props {
  job_id: string;
  candidate_id: string;
  status: string;
  limit: number;
}

const ApplicationsTable: React.FC<Props> = ({
  job_id,
  candidate_id,
  status,
  limit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.getApplication
  );

  const [isHandleInterviewModal, setIsHandleInterviewModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleOpenModal = (candidateId: string, applicationId: string) => {
    setSelectedCandidateId(candidateId);
    setSelectedApplicationId(applicationId);
    setIsHandleInterviewModal(true);
  };

  const handleCloseModal = () => {
    setIsHandleInterviewModal(false);
    setRefreshTrigger((prev) => !prev); // Trigger re-fetch
  };

  // Fetch applications when dependencies change
  useEffect(() => {
    dispatch(fetchApplications({ job_id, candidate_id, status, limit }));
  }, [dispatch, job_id, candidate_id, status, limit, refreshTrigger]);
  console.log("selectedCandidateId",selectedCandidateId,"selectedApplicationId",selectedApplicationId)
  // 🎨 Status badge colors
  const statusColors: Record<ApplicationStatus, string> = {
    NEW: "bg-gray-100 text-gray-600",
    INVITED: "bg-blue-100 text-blue-700",
    APPLIED: "bg-purple-100 text-purple-700",
    SCREENING: "bg-yellow-100 text-yellow-700",
    INTERVIEW: "bg-indigo-100 text-indigo-700",
    OFFER: "bg-teal-100 text-teal-700",
    HIRED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const columns = [
    {
      header: "Job ID",
      accessorKey: "jobId",
      cell: (info: any) => info.getValue() || "-",
    },
    {
      header: "Candidate ID",
      accessorKey: "candidateId",
      cell: (info: any) => info.getValue() || "-",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => {
        const value: ApplicationStatus = info.getValue();
        const classes = statusColors[value] || "bg-gray-100 text-gray-600";
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${classes}`}>
            {value}
          </span>
        );
      },
    },
    {
      header: "Match Score",
      accessorKey: "matchScore",
      cell: (info: any) => `${info.getValue()}%`,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: ({ row }: any) => {
        const candidateData = row.original;
        const isApplied = candidateData.status === "APPLIED";
        const hasInterview = Boolean(candidateData.interviewStatus);
        const candidateId = candidateData.candidateId;
        const applicationId = candidateData.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="space-y-2 p-2 w-52">
              {/* Schedule Interview */}
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => {
                    if (isApplied && !hasInterview)
                      handleOpenModal(candidateId, applicationId);
                  }}
                  disabled={!isApplied || hasInterview}
                  className={`w-full flex items-center justify-start gap-3 px-4 py-2 cursor-pointer rounded-md text-sm font-medium text-white transition-colors
              ${
                isApplied && !hasInterview
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : hasInterview
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
                >
                  <Calendar className="w-4 h-4" />
                  {isApplied && !hasInterview
                    ? "Schedule Interview"
                    : hasInterview
                    ? "Interview Scheduled"
                    : "Unavailable"}
                </Button>
              </DropdownMenuItem>

              {/* Share */}
              <DropdownMenuItem asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-3 px-3 py-2 cursor-pointer rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                  Share
                </Button>
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-3 px-3 py-2 cursor-pointer rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500">Loading applications...</p>
    );

  return (
    <div>
      {/* Table */}
      <table className="min-w-full text-sm border rounded-md">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                No applications found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* 🎯 Interview Schedule Modal (with row-specific data) */}
      <InterviewScheduleModal
        open={isHandleInterviewModal}
        onClose={handleCloseModal}
        candidateId={selectedCandidateId}
        applicationId={selectedApplicationId}
      />
    </div>
  );
};

export default ApplicationsTable;
