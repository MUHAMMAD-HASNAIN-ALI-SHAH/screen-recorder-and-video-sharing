import { create } from "zustand";

interface UploadStore {
  videos: {
    _id: string;
    url: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    views: number;
  }[];
  getMyVideos: () => Promise<void>;
  editUpload: (id: string, title: string, description: string) => Promise<void>;
}

const useProfileUploadStore = create<UploadStore>((set,get) => {
  return {
    videos: [],
    getMyVideos: async () => {
      try {
        const response = await fetch("/api/upload/user");
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        console.log("Fetched videos:", data.uploads);
        set({ videos: data.uploads });
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    },
    editUpload: async (id: string, title: string, description: string) => {
      try {
        const response = await fetch(`/api/upload/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
          throw new Error("Failed to edit upload");
        }

        get().getMyVideos();
      } catch (error) {
        console.error("Error editing upload:", error);
      }
    },
  };
});

export default useProfileUploadStore;
