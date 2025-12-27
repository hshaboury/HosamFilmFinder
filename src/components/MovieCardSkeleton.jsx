export default function MovieCardSkeleton() {
  return (
    <div className="card h-full animate-pulse bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-xl shadow-lg">
      <div className="w-full aspect-[2/3] bg-gray-800/80 rounded-t-xl"></div>
      <div className="p-3 sm:p-4">
        <div className="h-5 sm:h-6 bg-gray-800/80 rounded mb-2"></div>
        <div className="h-4 bg-gray-800/80 rounded w-2/3"></div>
      </div>
    </div>
  );
}