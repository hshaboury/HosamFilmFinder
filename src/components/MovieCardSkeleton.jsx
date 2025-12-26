export default function MovieCardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="w-full aspect-[2/3] bg-gray-700"></div>
      <div className="p-3 sm:p-4">
        <div className="h-5 sm:h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}