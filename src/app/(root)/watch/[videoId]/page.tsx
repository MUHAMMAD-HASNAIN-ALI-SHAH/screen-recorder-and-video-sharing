import VideoDetails from "@/components/Home/VideoDetails";

const page = async ({ params }: { params: { videoId: string } }) => {
  const videoId = params.videoId;

  if (!videoId) {
    return <div>Video not found</div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 bg-gray-50 mt-10">
      <main className="w-full max-w-5xl mx-auto px-5 lg:px-0 flex flex-col items-center gap-10">
        <VideoDetails videoId={videoId} />
      </main>
    </div>
  );
};

export default page;
