"use client";

import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface ImageUploaderProps {
  onCodeGenerated: (code: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onCodeGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const base64Image = (e.target?.result as string).split(",")[1];

      setIsLoading(true);
      try {
        const response = await axios.post("/api/vision", { base64Image });
        onCodeGenerated(response.data.code);
      } catch (error) {
        console.error("Failed to convert screenshot", error);
        alert("Failed to convert screenshot");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await processFile(file);
    }
  };

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-6 text-center 
        transition-all duration-300 ease-in-out
        ${
          dragActive
            ? "border-primary bg-primary/10 scale-105"
            : "border-secondary/50 hover:border-primary"
        }
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-50"
        id="file-upload"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <div className="animate-pulse">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-secondary">Processing screenshot...</p>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-secondary/70 group-hover:text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-secondary">
              {dragActive
                ? "Drop your screenshot here"
                : "Drag and drop or click to upload a screenshot"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
