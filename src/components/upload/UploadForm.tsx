"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "public",
  });

  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      title: "",
      description: "",
      type: "public",
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (name === "video") {
        setVideoPreview(previewUrl);
      } else if (name === "thumbnail") {
        setThumbnailPreview(previewUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const videoFile = (e.currentTarget.video as HTMLInputElement).files?.[0];
    const thumbnailFile = (e.currentTarget.thumbnail as HTMLInputElement)
      .files?.[0];

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    if (videoFile) data.append("video", videoFile);
    if (thumbnailFile) data.append("thumbnail", thumbnailFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success("Upload successful!");
      redirect("/profile");
    } else {
      toast.error("Upload failed: " + result.message);
      console.error("Upload failed:", result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-xl mx-auto mt-10 px-5 md:px-0 pb-5"
    >
      <h1 className="font-semibold text-xl">Upload Video</h1>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none resize-none"
        />
      </div>

      {/* Type Selection */}
      <div>
        <label htmlFor="type" className="block font-medium mb-1">
          Type
        </label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Video Upload */}
      <div>
        <label htmlFor="video" className="block font-medium mb-1">
          Upload Video
        </label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/*"
          required
          onChange={handleFileChange}
          className="block w-full"
        />
        {videoPreview && (
          <video src={videoPreview} controls className="mt-2 w-full rounded" />
        )}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label htmlFor="thumbnail" className="block font-medium mb-1">
          Upload Thumbnail
        </label>
        <input
          type="file"
          id="thumbnail"
          name="thumbnail"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full"
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="mt-2 w-full max-h-64 object-cover rounded"
          />
        )}
      </div>

      {/* Submit */}
      <div className="w-full flex justify-end items-center gap-4">
        {loading && (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded cursor-pointer text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
