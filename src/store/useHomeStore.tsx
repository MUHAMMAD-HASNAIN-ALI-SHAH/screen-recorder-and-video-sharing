import { toast } from "react-toastify";
import { create } from "zustand";

interface HomeStore {
  videos: {
    _id: string;
    url: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    views: number;
    user: {
      _id: string;
      name: string;
      image: string;
    };
  }[];
  loading: boolean;
  getMyVideos: () => Promise<void>;
}

const useHomeStore = create<HomeStore>((set) => ({
  videos: [],
  loading: false,
  getMyVideos: async () => {
    try {
      set({ loading: true });
      const response = await fetch("/api/upload");
      if (!response.ok) {
        toast.error("Failed to fetch videos");
        return;
      }
      const data = await response.json();
      set({ videos: data.uploads });
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useHomeStore;
