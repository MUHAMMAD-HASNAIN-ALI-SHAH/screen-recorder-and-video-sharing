"use client";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useProfileUploadStore from "@/store/useProfileUploadStore";

interface DetailsModelProps {
  closeModal: () => void;
  upload: {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    views: number;
  };
}

const DetailsModel: React.FC<DetailsModelProps> = ({ closeModal, upload }) => {
  const { editUpload } = useProfileUploadStore();
  const [title, setTitle] = useState(upload.title);
  const [description, setDescription] = useState(upload.description);
  const [hasChanged, setHasChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setHasChanged(title !== upload.title || description !== upload.description);
  }, [title, description, upload]);

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      editUpload(upload._id, title, description);
      toast.success("Video updated successfully!");
      setHasChanged(false);
      closeModal();
    } catch (err) {
      toast.error("Failed to update video");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/upload/${upload._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Video deleted successfully!");
        useProfileUploadStore.getState().getMyVideos();
        closeModal();
        redirect("/profile");
      } else {
        console.error("Delete failed:", data);
        toast.error(data?.message || "Failed to delete video");
      }
    } catch (err) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Upload</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isEditing || isDeleting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isEditing || isDeleting}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isEditing}
            className={`flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50`}
          >
            {isDeleting && <Loader2 className="animate-spin w-4 h-4" />}
            Delete
          </button>

          <button
            onClick={handleEdit}
            disabled={!hasChanged || isEditing || isDeleting}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              hasChanged
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-600"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isEditing && <Loader2 className="animate-spin w-4 h-4" />}
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModel;
