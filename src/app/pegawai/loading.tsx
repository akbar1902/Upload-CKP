export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
          <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 h-32"></div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-9 w-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-gray-50 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
