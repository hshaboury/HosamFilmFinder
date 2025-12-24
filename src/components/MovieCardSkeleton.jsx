export default function MovieCardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="w-full h-[400px] bg-gray-700"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
}