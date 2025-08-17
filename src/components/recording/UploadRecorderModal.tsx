"use client";

import useProfileUploadStore from "@/store/useProfileUploadStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface UploadRecorderModalProps {
  closeModal: () => void;
  videoUrl: string | null;
}

const UploadRecorderModal: React.FC<UploadRecorderModalProps> = ({
  closeModal,
  videoUrl,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !videoUrl || !thumbnailFile) {
      toast.error("Please fill in all fields and ensure a video is recorded.");
      setLoading(false);
      return;
    }

    try {
      const videoBlob = await fetch(videoUrl).then((res) => res.blob());
      const videoFile = new File([videoBlob], "recorded-video.webm", {
        type: "video/webm",
      });

      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("type", isPublic ? "public" : "private");
      data.append("video", videoFile);
      data.append("thumbnail", thumbnailFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Upload successful!");
        closeModal();
        useProfileUploadStore.getState().getMyVideos();
      } else {
        toast.error("Upload failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during upload.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-md h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Upload Video Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            className="w-full px-4 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setThumbnailFile(file);
                setThumbnailPreview(URL.createObjectURL(file));
              }
            }}
          />

          {thumbnailPreview && (
            <div className="mt-4">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="font-medium">Visibility:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="visibility"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                Public
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="visibility"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                Private
              </label>
            </div>
          </div>

          {videoUrl && (
            <div className="mt-4">
              <video
                src={videoUrl}
                controls
                className="w-full h-auto rounded"
              />
            </div>
          )}

          <div className="w-full flex justify-end items-center gap-4">
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default UploadRecorderModal;
