"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCandidates, deleteCandidate } from "@/lib/slices/candidate/candidate-slice";
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
import { HiArrowSmUp, HiArrowSmDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MainLayout } from "@/components/layout/main-layout";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CandidateDetails from "./details-candidate/page";

type Candidate = {
  id: string;
  name: string;
  email: string;
  status: string | null;
  interviewStatus: string | null;
};

export default function CandidatesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: candidates } = useSelector((state: RootState) => state.candidate);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [open, setOpen] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(
      fetchCandidates({
        skip: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, searchQuery, page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1);

  // Status color styles
  const applicationStatusColor: Record<string, string> = {
    NEW: "bg-red-100 text-red-600",
    INVITED: "bg-pink-100 text-pink-600",
    APPLIED: "bg-blue-100 text-blue-600",
    SCREENING: "bg-yellow-100 text-yellow-700",
    INTERVIEW: "bg-purple-100 text-purple-600",
    OFFER: "bg-green-100 text-green-600",
    HIRED: "bg-emerald-100 text-emerald-600",
    REJECTED: "bg-gray-200 text-gray-600",
  };

  const interviewStatusStyles: Record<string, string> = {
    "NOT SCHEDULED": "bg-gray-200 text-gray-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
    RESCHEDULED: "bg-purple-100 text-purple-700",
  };

  const columns: ColumnDef<Candidate>[] = [
    {
      id: "select",
      header: "S.No",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "status",
      header: "Candidate Status",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              applicationStatusColor[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value || "NEW"}
          </span>
        );
      },
    },
    {
      accessorKey: "interviewStatus",
      header: "Interview Status",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              interviewStatusStyles[value] || "bg-gray-100 text-gray-600"
            }`}
          >
            {value || "NOT SCHEDULED"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCandidate(candidate);
                  setOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => dispatch(deleteCandidate(candidate.id))}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: candidates || [],
    columns,
    state: { rowSelection, globalFilter: searchQuery },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-primary-gradient justify-between p-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Candidates</h1>
          <p className="text-white text-sm">
            View candidate profiles and manage them efficiently.
          </p>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <p className="text-white">
            Total candidates:{" "}
            <span className="text-yellow-200 text-2xl">
              {candidates?.length || 0}
            </span>
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center my-4 gap-4">
        <Input
          type="search"
          placeholder="Search Candidate..."
          className="w-full max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-t px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
          <HiChevronLeft /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={(candidates?.length ?? 0) < itemsPerPage}
        >
          Next <HiChevronRight />
        </Button>
      </div>

  
       {/* ✅ React Responsive Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "rounded-xl p-6 ",
        }}
      >
        {selectedCandidate && (
          <CandidateDetails candidateId={selectedCandidate.id} />
        )}
      </Modal>
    </MainLayout>
  );
}
