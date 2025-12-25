export default function MovieDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-10 w-24 bg-gray-700 rounded-lg mb-6"></div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Poster skeleton */}
        <div className="md:col-span-1">
          <div className="w-full aspect-[2/3] bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-700 rounded-lg mt-4"></div>
        </div>

        {/* Details skeleton */}
        <div className="md:col-span-2 space-y-6">
          {/* Title */}
          <div className="h-10 bg-gray-700 rounded w-3/4"></div>

          {/* Meta info */}
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-gray-700 rounded"></div>
            <div className="h-6 w-20 bg-gray-700 rounded"></div>
            <div className="h-6 w-20 bg-gray-700 rounded"></div>
          </div>

          {/* Ratings */}
          <div className="flex gap-4">
            <div className="h-20 w-32 bg-gray-700 rounded-lg"></div>
            <div className="h-20 w-32 bg-gray-700 rounded-lg"></div>
            <div className="h-20 w-32 bg-gray-700 rounded-lg"></div>
          </div>

          {/* Genre tags */}
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-700 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-700 rounded-full"></div>
          </div>

          {/* Plot */}
          <div className="space-y-2">
            <div className="h-6 w-24 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>

          {/* Cast & Crew */}
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>

          {/* Additional info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}