import VideoDetails from "@/components/Home/VideoDetails";

interface PageProps {
  params: {
    videoId: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { videoId } = params;

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

export default Page;
