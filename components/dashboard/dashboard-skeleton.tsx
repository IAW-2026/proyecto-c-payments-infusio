interface DashboardSkeletonProps {
  showHeader?: boolean;
}

export function DashboardSkeleton({ showHeader = true }: DashboardSkeletonProps) {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-4 w-32 bg-tan/20 rounded-full mb-2" />
            <div className="h-10 w-64 bg-tan/30 rounded-2xl" />
          </div>
          <div className="h-12 w-40 bg-tan/20 rounded-full self-start md:self-center" />
        </div>
      )}

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-tan/30 shadow-sm h-36 flex flex-col justify-between">
            <div>
              <div className="h-3 w-20 bg-tan/20 rounded-full mb-3" />
              <div className="h-8 w-28 bg-tan/30 rounded-xl" />
            </div>
            <div className="h-3 w-16 bg-tan/20 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-tan/30 shadow-sm h-96">
            <div className="h-6 w-48 bg-tan/30 rounded-xl mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-tan/10 last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-tan/30 rounded-md" />
                    <div className="h-3 w-16 bg-tan/20 rounded-md" />
                  </div>
                  <div className="h-6 w-20 bg-tan/20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-3xl border border-tan/30 shadow-sm h-[320px]">
            <div className="h-6 w-32 bg-tan/30 rounded-xl mb-6" />
            <div className="h-48 w-full bg-tan/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
