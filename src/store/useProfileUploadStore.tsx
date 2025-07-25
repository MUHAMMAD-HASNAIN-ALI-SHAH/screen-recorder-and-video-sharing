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
}

const useProfileUploadStore = create<UploadStore>((set) => {
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
  };
});

export default useProfileUploadStore;
