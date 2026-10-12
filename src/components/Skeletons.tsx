import React from 'react';

export const SkeletonDifferentials: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#090D16]/80 relative border-t border-white/[0.05] overflow-x-clip animate-pulse">
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="h-6 w-28 bg-slate-800/80 rounded-full mx-auto" />
          <div className="h-10 w-3/4 max-w-lg bg-slate-800/60 rounded-xl mx-auto" />
          <div className="h-4 w-1/2 max-w-md bg-slate-800/40 rounded mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/[0.06] bg-[#0A0E17]/80 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80" />
                  <div className="w-8 h-4 bg-slate-800/50 rounded" />
                </div>
                <div className="h-5 w-3/4 bg-slate-700/60 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-slate-800/50 rounded" />
                  <div className="h-3.5 w-5/6 bg-slate-800/40 rounded" />
                  <div className="h-3.5 w-2/3 bg-slate-800/30 rounded" />
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-white/[0.04] flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-800/60" />
                <div className="w-24 h-3 bg-slate-800/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SkeletonPortfolio: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen animate-pulse">
      <div className="page-shell page-x">
        {/* Header Skeleton */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="h-6 w-32 bg-slate-800/80 rounded-full mx-auto" />
          <div className="h-10 w-2/3 max-w-md bg-slate-800/60 rounded-xl mx-auto" />
          <div className="h-4 w-1/2 max-w-sm bg-slate-800/40 rounded mx-auto" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex justify-center gap-2 mb-10">
          <div className="h-9 w-24 bg-slate-800/70 rounded-xl" />
          <div className="h-9 w-32 bg-slate-800/50 rounded-xl" />
          <div className="h-9 w-32 bg-slate-800/50 rounded-xl" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-[#0A0E17]/80 p-5 flex flex-col min-h-[580px]"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-28 bg-slate-800/60 rounded-full" />
                <div className="h-4 w-20 bg-slate-800/40 rounded" />
              </div>

              {/* Title & Description */}
              <div className="h-6 w-4/5 bg-slate-700/60 rounded mb-2" />
              <div className="h-3.5 w-full bg-slate-800/40 rounded mb-1" />
              <div className="h-3.5 w-3/4 bg-slate-800/30 rounded mb-4" />

              {/* Mockup Preview Wireframe */}
              <div className="relative min-h-[300px] w-full rounded-xl bg-slate-900/60 border border-white/[0.05] p-3 mb-4 flex flex-col justify-between">
                <div className="h-5 w-full bg-slate-800/80 rounded" />
                <div className="h-44 w-full bg-slate-800/40 rounded-lg my-2" />
                <div className="h-4 w-1/3 bg-slate-800/50 rounded" />
              </div>

              {/* Card Footer Actions */}
              <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <div className="h-4 w-28 bg-slate-800/50 rounded" />
                <div className="h-8 w-24 bg-slate-800/60 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SkeletonServices: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen animate-pulse">
      <div className="page-shell page-x">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="h-6 w-28 bg-slate-800/80 rounded-full mx-auto" />
          <div className="h-10 w-2/3 bg-slate-800/60 rounded-xl mx-auto" />
          <div className="h-4 w-1/2 bg-slate-800/40 rounded mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0A0E17]/80 p-7 min-h-[500px]">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 mb-4" />
              <div className="h-6 w-3/4 bg-slate-700/60 rounded mb-3" />
              <div className="h-4 w-full bg-slate-800/40 rounded mb-2" />
              <div className="h-4 w-2/3 bg-slate-800/30 rounded mb-6" />
              <div className="space-y-2 mb-8">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-3 w-5/6 bg-slate-800/30 rounded" />
                ))}
              </div>
              <div className="h-11 w-full bg-slate-800/70 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const SkeletonBooking: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#090D16] relative min-h-screen animate-pulse">
      <div className="page-shell page-x max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="h-6 w-36 bg-slate-800/80 rounded-full mx-auto" />
          <div className="h-10 w-3/4 bg-slate-800/60 rounded-xl mx-auto" />
          <div className="h-4 w-1/2 bg-slate-800/40 rounded mx-auto" />
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-[#0A0E17]/80 p-8 space-y-6">
          <div className="h-8 w-1/3 bg-slate-700/60 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-12 bg-slate-800/50 rounded-xl" />
            <div className="h-12 bg-slate-800/50 rounded-xl" />
          </div>
          <div className="h-28 bg-slate-800/40 rounded-xl" />
          <div className="h-12 w-48 bg-slate-800/70 rounded-xl" />
        </div>
      </div>
    </section>
  );
};
