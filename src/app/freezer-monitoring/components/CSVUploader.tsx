'use client';

import React, { useState } from 'react';

interface CSVUploaderProps {
  freezerId: string;
  onUploadSuccess?: () => void;
}

export default function CSVUploader({ freezerId, onUploadSuccess }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setSuccess(false);
      } else {
        alert('Please drop a valid .csv log file.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setSuccess(false);
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const response = await fetch('/api/upload-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvText, freezerId }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload logs.');
        }

        setSuccess(true);
        setFile(null);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } catch (err: any) {
        alert(err.message || 'Error parsing file.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-xl border border-sky-500/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md">
      <h4 className="font-bold text-white tracking-wide mb-4">Upload Freezer Log CSV</h4>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${
          dragActive
            ? 'border-sky-400 bg-sky-500/10'
            : file
            ? 'border-sky-500/35 bg-slate-950/20'
            : 'border-slate-800 bg-slate-950/40 hover:border-sky-500/20 hover:bg-slate-950/50'
        }`}
      >
        <input
          type="file"
          id="file-upload-input"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".csv"
          disabled={uploading}
        />

        <div className="text-center z-10 pointer-events-none">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              <p className="mt-3 text-xs text-sky-400 font-semibold uppercase tracking-wider">
                Ingesting records...
              </p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                ✓
              </span>
              <p className="mt-3 text-sm font-semibold text-white">Log Processed Successfully</p>
              <p className="mt-1 text-xs text-slate-500">Freezer history graphs populated</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center">
              <span className="text-3xl">📊</span>
              <p className="mt-3 text-sm font-semibold text-white truncate max-w-[200px]">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">📥</span>
              <p className="text-sm font-medium text-slate-300">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Accepts standard 7-day temperature log files
              </p>
            </div>
          )}
        </div>
      </div>

      {file && !uploading && (
        <button
          onClick={handleUpload}
          className="mt-4 w-full rounded-lg bg-sky-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/10"
        >
          Parse Log File
        </button>
      )}
    </div>
  );
}
