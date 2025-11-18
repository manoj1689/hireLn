"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadResume,
  clearUpload,
} from "@/lib/slices/aitools/upload-resume-slice";
import { AppDispatch, RootState } from "@/lib/store";

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

  const { items } = useSelector((state: RootState) => state.resumeUpload);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // 🔥 Upload files sequentially
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    for (const file of selectedFiles) {
      await dispatch(uploadResume(file)); // upload one by one
    }

    setUploading(false);
  };

  const closeDialog = () => {
    setSelectedFiles([]);
    dispatch(clearUpload());
    setShowBulkUploadDialog(false);
  };

  return (
    <Modal
      open={showBulkUploadDialog}
      onClose={closeDialog}
      center
      classNames={{ modal: "w-full rounded-2xl" }}
    >
      <div className="w-full px-2 sm:px-4">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload Resumes</h2>

        {/* Upload button */}
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

          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Selected file list */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm font-medium">Selected Files:</Label>
            <ul className="text-sm list-disc pl-5 mt-2 text-muted-foreground">
              {selectedFiles.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload button */}
        {selectedFiles.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button
              className="px-12 rounded-full"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : null}
              Start Upload
            </Button>
          </div>
        )}

        {/* 🔥 Result list */}
        {items.length > 0 && (
          <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
              >
                {/* Status icon */}
                {item.status === "uploading" && (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                )}
                {item.status === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {item.status === "error" && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}

                {/* Details */}
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>

                  <span className="text-sm opacity-75">
                    {item.status === "uploading" && "Uploading..."}
                    {item.status === "success" && "Uploaded Successfully"}
                    {item.status === "error" && `Error: ${item.error}`}
                  </span>

                  {/* Show parsed response */}
                  {item.response && (
                    <pre className="bg-white p-2 mt-2 flex rounded text-xs border">
                      {JSON.stringify(item.response, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
