"use client";

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

import {
  listScreenshots,
  deleteScreenshot,
} from "@/lib/slices/screenshots/screenshotsSlice";

import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InterviewScreenshotsPage({
  interviewId,
}: {
  interviewId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { screenshots, loading } = useSelector(
    (state: RootState) => state.screenshots
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ⭐ Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    if (interviewId) {
      dispatch(listScreenshots({ interviewId }));
    }
  }, [dispatch, interviewId]);

  const handleDelete = (id: string) => {
    if (!confirm("Delete screenshot?")) return;
    dispatch(deleteScreenshot({ id }));
  };

  if (loading) {
    return <p className="p-6 text-center">Loading screenshots...</p>;
  }

  // ⭐ Paginate screenshots
  const offset = currentPage * itemsPerPage;
  const currentItems = screenshots.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(screenshots.length / itemsPerPage);

  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Interview Screenshots</h1>

      {screenshots.length === 0 ? (
        <p className="text-gray-500">No screenshots found.</p>
      ) : (
        <>
          {/* Screenshots Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentItems.map((shot) => (
              <div
                key={shot.id}
                className="relative rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={shot.imageUrl}
                  onClick={() => setSelectedImage(shot.imageUrl)}
                  className="w-full h-40 object-cover"
                  alt="Screenshot"
                />

                {/* Flags */}
                <div className="absolute top-1 left-1 space-y-2 text-white text-xs">
                  <div className="bg-black/60 px-2 py-1 rounded">
                    Face Verified: {String(shot.faceVerified)}
                  </div>

                  <div className="bg-black/60 px-2 py-1 rounded">
                    Multi Face: {String(shot.multiFace)}
                  </div>
                </div>

                {/* Timestamp & Note */}
                <div className="p-2 text-xs text-gray-700">
                  <p>{new Date(shot.capturedAt).toLocaleString()}</p>
                  {shot.note && (
                    <p className="text-blue-600">Note: {shot.note}</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(shot.id)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <Trash size={14} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>

          {/* ⭐ React Pagination Component */}
          <div className="mt-6 flex justify-center">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex gap-2 items-center"}
              pageClassName={"px-3 py-1 border rounded cursor-pointer"}
              activeClassName={"bg-primary text-white"}
              previousClassName={"px-3 py-1 border rounded cursor-pointer"}
              nextClassName={"px-3 py-1 border rounded cursor-pointer"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        </>
      )}

      {/* Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Screenshot Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              className="w-full rounded-lg"
              alt="Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
