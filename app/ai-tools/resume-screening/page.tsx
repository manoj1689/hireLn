"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchResumesFromDrive,
  clearDriveData,
} from "@/lib/slices/aitools/resume-parcing-slice";
import { MainLayout } from "@/components/layout/main-layout";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DriveResumesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { driveParsed, driveLoading, driveError } = useSelector(
    (state: RootState) => state.resumeParcing
  );

  const [folderId, setFolderId] = useState("");
  const [limit, setLimit] = useState(10);

  const handleFetch = () => {
    if (!folderId.trim()) {
      alert("Please enter a valid folder ID");
      return;
    }
    dispatch(fetchResumesFromDrive({ folder_id: folderId, limit }));
  };

  useEffect(() => {
    return () => {
      dispatch(clearDriveData());
    };
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/ai-tools")}
          className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:underline mb-4"
        >
          <FaArrowLeft /> back to Ai-Tools
        </button>

        {/* Header */}
        <div className="bg-primary-gradient p-6 rounded-2xl shadow-lg mb-6 text-white backdrop-blur-md">
          <h1 className="text-2xl font-bold">Resumes Parsing</h1>
          <p className="text-base font-light opacity-90">
            Candidates Resumes from Google Drive
          </p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex flex-col lg:flex-row items-center text-center sm:text-left gap-4 mx-auto bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-200 w-full max-w-2xl md:max-w-3xl">
            <img
              src="/images/candidate/google-drive.png"
              alt="google-drive"
              className="w-14 h-14 object-contain self-center"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Google Drive Folder ID
              </label>
              <input
                type="text"
                placeholder="Enter Google Drive Folder ID"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 lg:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Limit</label>
              <input
                type="number"
                min={1}
                placeholder="Limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>
          </div>

          {/* Fetch Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleFetch}
              disabled={driveLoading}
              className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {driveLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Resumes"
              )}
            </Button>
          </div>
        </div>

        {/* Status */}
        {driveError && <p className="text-red-500 mt-4">{driveError}</p>}
        {!driveLoading && driveParsed.length === 0 && !driveError && (
          <p className="text-gray-500 mt-4">No resumes found.</p>
        )}

        {/* Resume List */}
        {driveParsed?.summary?.length > 0 && (
          <div className="flex flex-col gap-4 mt-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {driveParsed.summary.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm transition ${
                  item.success
                    ? "border-green-300 bg-green-50 hover:bg-green-100"
                    : "border-red-300 bg-red-50 hover:bg-red-100"
                }`}
              >
                {item.success ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <span className="font-semibold text-gray-900">
                    {item.file}
                  </span>
                  <p className="text-sm text-gray-600">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

