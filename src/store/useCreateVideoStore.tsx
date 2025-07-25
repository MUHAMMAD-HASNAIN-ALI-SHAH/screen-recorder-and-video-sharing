import { create } from "zustand";

interface CreateVideoStore {
  videoUrl: string | null;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

const useCreateVideoStore = create<CreateVideoStore>((set, get) => {
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];
  let stream: MediaStream | null = null;

  return {
    videoUrl: null,
    isRecording: false,

    startRecording: async () => {
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          set({ videoUrl: url });
        };

        // Handle browser "Stop sharing"
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          get().stopRecording();
        });

        mediaRecorder.start();
        set({ isRecording: true });
      } catch (err) {
        console.error("Error accessing screen:", err);
      }
    },

    stopRecording: () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        set({ isRecording: false });
        stream?.getTracks().forEach((track) => track.stop());
      }
    },
  };
});

export default useCreateVideoStore;
