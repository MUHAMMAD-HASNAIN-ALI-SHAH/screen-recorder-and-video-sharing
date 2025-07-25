"use client";
import React from "react";
import useCreateVideoStore from "@/store/useCreateVideoStore";
import { Video } from "lucide-react";

const ScreenRecorder = () => {
  const { startRecording, stopRecording, isRecording, videoUrl } =
    useCreateVideoStore();

  return (
    <div className="">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Video />
          Start Screen Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="cursor-pointer flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Video />
          Stop Recording
        </button>
      )}
    </div>
  );
};

export default ScreenRecorder;
