export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div className="space-y-2">
            <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="h-4 w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-7 w-36 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
                </div>
                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse ml-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5 space-y-1.5">
            <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-28 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <div className="flex items-end gap-3 h-[280px] px-2">
            {[65, 90, 45, 78, 55, 88, 40, 72].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full rounded-t-md bg-slate-200 dark:bg-slate-800 animate-pulse"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="mb-5 space-y-1.5">
            <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-44 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
          {/* Filter bar skeleton */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="w-40 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="w-32 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
          {/* Rows skeleton */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="h-10 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 ${
                  i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'
                }`}
              >
                <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse font-mono" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-2.5 w-44 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
                </div>
                <div className="h-3 w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}