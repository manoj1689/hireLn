"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadResumes,
  clearUploads,
} from "@/lib/slices/aitools/upload-resume-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

interface Props {
  showBulkUploadDialog: boolean;
  setShowBulkUploadDialog: (open: boolean) => void;
}

export default function BulkResumeUploadDialog({
  showBulkUploadDialog,
  setShowBulkUploadDialog,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { uploaded, loading, error } = useSelector(
    (state: RootState) => state.resumeUpload
  );
  console.log("uploaded", uploaded);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  // ✅ Detect upload completion
  useEffect(() => {
    if (uploaded?.length && !loading) {
      setUploadComplete(true);
    }
  }, [uploaded, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setUploadComplete(false);
      await dispatch(uploadResumes(selectedFiles));
    }
  };

  const handleAddMore = () => {
    setSelectedFiles([]);
    dispatch(clearUploads());
    setUploadComplete(false);
  };

  const closeDialog = () => {
    setSelectedFiles([]);
    setUploadComplete(false);
    dispatch(clearUploads());
    setShowBulkUploadDialog(false);
  };

  return (
    <Modal
      open={showBulkUploadDialog}
      onClose={closeDialog}
      center
      classNames={{ modal: "max-w-4xl rounded-2xl" }}
    >
      <div className="w-full max-w-md px-2 sm:px-4">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload Resumes</h2>

        {/* Loading State */}
        {loading ? (
          <div className="flex w-full mt-6 flex-col justify-center items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-20 w-20 animate-spin text-green-300" />
            <span className="text-gray-400">
              Processing resumes, please wait...
            </span>
          </div>
        ) : (
          <div className="mt-6 flex-col w-full justify-end gap-2 space-y-4">
            {/* Upload area (hide when upload complete) */}
            {!uploadComplete && (
              <>
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer rounded-lg border border-dashed p-10 text-center hover:bg-muted/50 transition block"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">
                    Drag and drop your PDF files here
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    or click to browse
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Supported formats: PDF
                  </p>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* Selected files list */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-sm font-medium">
                      Selected Resumes:
                    </Label>
                    <ul className="text-sm list-disc pl-5 text-muted-foreground">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Upload results */}
            {uploaded?.length > 0 && (
              <div className="flex flex-col gap-3 mt-4 max-h-72 overflow-y-auto">
                {uploaded.map((item: any, idx: number) => {
                  const isSuccess = item.success !== false; // success = undefined or true
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        isSuccess
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}

                      <div className="flex flex-col">
                        <span className="font-medium">{item.resume_name}</span>
                        {isSuccess ? (
                          <span className="text-sm opacity-80">
                            ✅ Uploaded successfully <br />
                            <span className="text-xs text-gray-600">
                              ID: {item.resume_id}
                            </span>
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 mt-1">
                            ❌ {item.message}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex justify-center  mt-6">
              {!uploadComplete ? (
                <>
                  <Button
                    className="px-12 rounded-full"
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                  >
                    Upload
                  </Button>
                </>
              ) : (
                <>
                <div>

                </div>
                 
                  <Button className="px-12 rounded-full" onClick={handleAddMore}>+ Add More</Button>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-600">❌ Error: {error}</div>
        )}
      </div>
    </Modal>
  );
}
