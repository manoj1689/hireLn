"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMatchedCandidatesByJobId } from "@/lib/slices/aitools/matched-candidate-Slice";
import {
  postApplication,
  resetApplications,
} from "@/lib/slices/applicant/application-slice";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { MdOpenInNew } from "react-icons/md";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import PreviewCandidateDetails from "@/app/candidates/preview-candidate/page";

type Candidate = {
  resume_id: string;
  candidate_id: string;
  name: string;
  email: string;
  filename: string;
  overall_semantic_score: number;
};

export default function Page() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth); // ✅ Added user
  const { matchedCandidates, loading: matchedLoading } = useSelector(
    (state: RootState) => state.matchedCandidate
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [selectedResumeData, setSelectedResumeData] = useState<
    { candidate_id: string; resume_id: string; overall_semantic_score: number }[]
  >([]);
  const [createdCandidates, setCreatedCandidates] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);

    const { applications, loading, error } = useSelector(
    (state: RootState) => state.application
  );

  // ✅ Fetch matched resumes
  useEffect(() => {
    if (jobId) dispatch(fetchMatchedCandidatesByJobId(jobId));
  }, [jobId, dispatch]);

  // ✅ Table Columns
  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center gap-2">
          <span>S.No</span>
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.index + 1}</span>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "filename", header: "Resume File" },
    {
      accessorKey: "overall_semantic_score",
      header: "Score",
      cell: (info) => `${info.getValue()}%`,
    },
    {
      id: "view",
      header: "View",
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            setSelectedCandidate(row.original);
            setPreviewModalOpen(true);
          }}
        >
          <MdOpenInNew color="orange" className="w-5 h-5" />
        </button>
      ),
    },
  ];

  // ✅ Setup table
  const table = useReactTable({
    data: matchedCandidates || [],
    columns,
    state: { rowSelection, globalFilter },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ✅ Sync selected rows
  useEffect(() => {
    const selected = table.getSelectedRowModel().flatRows.map((r) => ({
      resume_id: r.original.resume_id,
      candidate_id: r.original.candidate_id,
      overall_semantic_score: r.original.overall_semantic_score,
    }));
    setSelectedResumeData(selected);
  }, [table.getState().rowSelection]);

  // ✅ Invite Candidates
  const handleInviteCandidates = async () => {
    if (selectedResumeData.length === 0 || !jobId) return;

    setIsParsing(true);
    setCreatedCandidates([]);
    dispatch(resetApplications());

    const results: any[] = [];

    for (const item of selectedResumeData) {
      const { candidate_id, overall_semantic_score } = item;

      try {
        const appRes = await dispatch(
          postApplication({
            jobId,
            candidateId: candidate_id,
            coverLetter: "AI Interview Invitation",
            userId: user?.id || "",
            appliedAt: new Date().toISOString(),
            matchScore: Math.round(overall_semantic_score || 0),
          })
        );

        if (postApplication.fulfilled.match(appRes)) {
          results.push({
            candidateId: candidate_id,
            status: "success",
            message: "🎉 Candidate invited successfully",
          });
        } else {
          results.push({
            candidateId: candidate_id,
            status: "error",
            message: error,
          });
        }
      } catch {
        results.push({
          candidateId: candidate_id,
          status: "error",
          message: "❌ Error inviting candidate",
        });
      }
    }

    setCreatedCandidates(results);
    setModalOpen(true);
    setIsParsing(false);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white p-4 rounded-lg justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Matched Resumes</h1>
          <p>Manage candidates matched to this job</p>
        </div>
      </div>

      {/* Loading */}
      {matchedLoading && (
        <div className="flex items-center justify-center my-6">
          <div className="animate-spin h-8 w-8 border-2 border-t-2 border-gray-400 rounded-full" />
          <p className="ml-2">Loading candidates...</p>
        </div>
      )}

      {/* Table */}
      {!matchedLoading && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border rounded-md px-3 py-2 mb-4 w-full max-w-sm"
          />

          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b px-4 py-2 bg-gray-100 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <HiArrowSmUp
                          className={`w-4 h-4 ${
                            header.column.getIsSorted() === "asc"
                              ? "text-indigo-600"
                              : "text-gray-400"
                          }`}
                        />
                        <HiArrowSmDown
                          className={`w-4 h-4 ${
                            header.column.getIsSorted() === "desc"
                              ? "text-indigo-600"
                              : "text-gray-400"
                          }`}
                        />
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border rounded flex items-center gap-1"
            >
              <HiChevronLeft /> Previous
            </button>

            <span>
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded flex items-center gap-1"
            >
              Next <HiChevronRight />
            </button>
          </div>

          {/* Invite Button */}
          <div className="flex mt-6 justify-center">
            <Button
              className="px-12 py-2 rounded-full flex items-center gap-2"
              onClick={handleInviteCandidates}
              disabled={selectedResumeData.length === 0 || isParsing}
            >
              {isParsing && (
                <span className="animate-spin border-2 border-t-transparent rounded-full w-4 h-4" />
              )}
              {isParsing ? "Processing..." : "Invite Candidate"}
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Result Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        center
        classNames={{ modal: "max-w-3xl rounded-2xl" }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Candidate Invitation Summary
        </h2>

        <div className="flex flex-col gap-3">
          {createdCandidates.map((res, i) => (
            <div
              key={i}
              className={`p-3 rounded-md border ${
                res.status === "success"
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              <p>
                <strong>Candidate ID:</strong> {res.candidateId}
              </p>
              <p
                className={
                  res.status === "success" ? "text-green-600" : "text-red-600"
                }
              >
                {res.message}
              </p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Resume preview */}
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        classNames={{ modal: "max-w-3xl rounded-2xl" }}
      >
        {selectedCandidate && (
          <PreviewCandidateDetails resumeId={selectedCandidate.resume_id} />
        )}
      </Modal>
    </MainLayout>
  );
}
