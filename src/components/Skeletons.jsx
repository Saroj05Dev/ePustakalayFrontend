import React from "react";
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20] font-['Inter',sans-serif] antialiased">
      {/* ── Hero Section Skeleton ── */}
      <section className="relative min-h-[550px] md:min-h-[700px] flex items-center px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto pt-24 md:pt-28">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full py-10 md:py-16">
          {/* Left Hero */}
          <div className="space-y-6">
            <div className="w-32 h-4 rounded-full youtube-shimmer" />
            <div className="flex flex-col gap-3">
              <div className="w-11/12 h-10 md:h-14 lg:h-16 rounded-2xl youtube-shimmer" />
              <div className="w-4/5 h-10 md:h-14 lg:h-16 rounded-2xl youtube-shimmer" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="w-full h-4 rounded-md youtube-shimmer" />
              <div className="w-4/5 h-4 rounded-md youtube-shimmer" />
              <div className="w-2/3 h-4 rounded-md youtube-shimmer" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="w-full sm:w-44 h-13 rounded-xl youtube-shimmer" />
              <div className="w-40 h-10 rounded-lg youtube-shimmer" />
            </div>
          </div>

          {/* Right Hero Image Skeleton */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
            <div className="w-full h-full rounded-3xl youtube-shimmer shadow-lg" />
            <div className="absolute -bottom-4 left-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 w-64 border border-[#e5e8ee]">
              <div className="w-10 h-10 rounded-full youtube-shimmer shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-28 h-4 rounded-md youtube-shimmer" />
                <div className="w-36 h-3 rounded-md youtube-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse Collections (Bento Grid) Skeleton ── */}
      <section className="bg-[#f1f4fa] py-12 md:py-20 px-4 md:px-6 lg:px-12 mt-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-2 mb-8 md:mb-12">
            <div className="w-56 h-8 rounded-lg youtube-shimmer" />
            <div className="w-72 h-4 rounded-md youtube-shimmer" />
          </div>

          {/* Bento Cards Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[450px]">
            <div className="sm:col-span-2 sm:row-span-2 rounded-2xl youtube-shimmer min-h-[300px]" />
            <div className="rounded-2xl youtube-shimmer min-h-[200px]" />
            <div className="rounded-2xl youtube-shimmer min-h-[200px]" />
            <div className="sm:col-span-2 rounded-2xl youtube-shimmer min-h-[200px]" />
          </div>
        </div>
      </section>

      {/* ── Featured Arrivals Skeleton ── */}
      <section className="py-12 md:py-20 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="w-52 h-8 rounded-lg youtube-shimmer" />
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full youtube-shimmer" />
            <div className="w-10 h-10 rounded-full youtube-shimmer" />
          </div>
        </div>
        <BookGridSkeleton count={4} gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" />
      </section>

      {/* ── Newsletter Skeleton ── */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto mb-10">
        <div className="bg-[#002629] rounded-3xl p-8 md:p-14 flex flex-col gap-6 shadow-xl">
          <div className="w-3/4 max-w-lg h-10 rounded-xl youtube-shimmer opacity-80" />
          <div className="w-full max-w-md h-4 rounded-md youtube-shimmer opacity-60" />
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mt-2">
            <div className="flex-1 h-12 rounded-xl youtube-shimmer opacity-40" />
            <div className="w-32 h-12 rounded-xl youtube-shimmer opacity-90" />
          </div>
        </div>
      </section>
    </div>
  );
}

// bookdetails section part

export function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20] font-['Inter',sans-serif] antialiased">
      {/* Top Navbar Placeholder / Skeleton */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-[#e5e8ee] px-4 md:px-8 py-4 fixed top-0 left-0 z-30 flex items-center justify-between">
        <div className="w-32 h-7 rounded-lg youtube-shimmer" />
        <div className="flex gap-4">
          <div className="w-20 h-8 rounded-lg youtube-shimmer" />
          <div className="w-20 h-8 rounded-lg youtube-shimmer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20 lg:pb-24">
        {/* Book Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start">

          {/* Left: Cover Skeleton */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] w-full rounded-2xl youtube-shimmer shadow-md relative overflow-hidden border border-[#e5e8ee]">
              {/* Badge placeholder */}
              <div className="absolute top-4 left-4 w-28 h-6 rounded-full youtube-shimmer opacity-90 border border-white/40" />
            </div>
          </div>

          {/* Right: Details Skeleton */}
          <div className="md:col-span-7 flex flex-col gap-6">

            {/* Category / Badge line */}
            <div className="w-24 h-4 rounded-full youtube-shimmer" />

            {/* Title Skeleton */}
            <div className="flex flex-col gap-3">
              <div className="w-11/12 h-9 sm:h-11 md:h-12 rounded-xl youtube-shimmer" />
              <div className="w-2/3 h-9 sm:h-11 md:h-12 rounded-xl youtube-shimmer" />
            </div>

            {/* Author & Rating Row */}
            <div className="flex items-center gap-3">
              <div className="w-36 h-5 rounded-md youtube-shimmer" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-28 h-5 rounded-md youtube-shimmer" />
            </div>

            {/* Price Skeleton */}
            <div className="w-32 h-10 rounded-xl youtube-shimmer my-1" />

            {/* Synopsis Header & Body */}
            <div className="flex flex-col gap-2.5">
              <div className="w-20 h-4 rounded-md youtube-shimmer" />
              <div className="w-full h-4 rounded-md youtube-shimmer" />
              <div className="w-11/12 h-4 rounded-md youtube-shimmer" />
              <div className="w-4/5 h-4 rounded-md youtube-shimmer" />
              <div className="w-2/3 h-4 rounded-md youtube-shimmer" />
            </div>

            {/* Meta Bento Skeleton (4 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl youtube-shimmer p-3 flex flex-col justify-between" />
              ))}
            </div>

            {/* Main Action Buttons Row */}
            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <div className="h-13 rounded-xl youtube-shimmer flex-1 min-w-[140px]" />
              <div className="h-13 rounded-xl youtube-shimmer flex-1 min-w-[140px]" />
            </div>

            {/* Read Now Button Skeleton */}
            <div className="w-full h-14 rounded-xl youtube-shimmer" />
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <section className="mt-16 sm:mt-20 md:mt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
            <div>
              <div className="w-48 h-8 rounded-lg youtube-shimmer mb-2" />
              <div className="w-64 h-4 rounded-md youtube-shimmer" />
            </div>
            <div className="w-32 h-6 rounded-md youtube-shimmer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="p-6 md:p-8 rounded-2xl bg-white border border-[#e5e8ee] shadow-sm flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 rounded-md youtube-shimmer" />
                    <div className="w-14 h-6 rounded-lg youtube-shimmer" />
                  </div>
                  <div className="w-full h-4 rounded-md youtube-shimmer mt-2" />
                  <div className="w-4/5 h-4 rounded-md youtube-shimmer" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full youtube-shimmer" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-28 h-4 rounded-md youtube-shimmer" />
                    <div className="w-20 h-3 rounded-md youtube-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// book page section

export function BooksPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9ff] font-['Inter',sans-serif] antialiased flex flex-col md:flex-row pt-20 md:pt-24 max-w-9xl mx-auto">
      {/* Sidebar Filter Skeleton (Desktop) */}
      <aside className="hidden md:flex w-72 lg:w-80 shrink-0 p-6 bg-white border-r border-[#e5e8ee] flex-col gap-6">
        <div className="w-36 h-7 rounded-lg youtube-shimmer mb-2" />
        {/* Search Input Skeleton */}
        <div className="w-full h-11 rounded-xl youtube-shimmer" />
        {/* Price Slider Skeleton */}
        <div className="flex flex-col gap-3 my-2">
          <div className="w-28 h-4 rounded-md youtube-shimmer" />
          <div className="w-full h-3 rounded-full youtube-shimmer" />
        </div>
        {/* Categories List Skeleton */}
        <div className="flex flex-col gap-3">
          <div className="w-32 h-4 rounded-md youtube-shimmer" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded youtube-shimmer" />
              <div className="w-36 h-4 rounded-md youtube-shimmer" />
            </div>
          ))}
        </div>
        {/* Languages Pill Skeleton */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="w-24 h-4 rounded-md youtube-shimmer" />
          <div className="flex gap-2">
            <div className="w-12 h-6 rounded-full youtube-shimmer" />
            <div className="w-16 h-6 rounded-full youtube-shimmer" />
            <div className="w-14 h-6 rounded-full youtube-shimmer" />
          </div>
        </div>
      </aside>

      {/* Main Area Skeleton */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col gap-6 min-w-0">
        {/* Header Title Banner Skeleton */}
        <div className="w-full bg-white p-6 rounded-xl border border-[#e5e8ee] flex flex-col gap-3 shadow-xs">
          <div className="w-64 h-8 rounded-lg youtube-shimmer" />
          <div className="w-96 max-w-full h-4 rounded-md youtube-shimmer" />
        </div>

        {/* Filters & Sort Controls Row Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="w-32 h-10 rounded-xl youtube-shimmer" />
          <div className="w-44 h-10 rounded-xl youtube-shimmer" />
        </div>

        {/* Books Grid Skeleton */}
        <BookGridSkeleton count={8} />
      </main>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white relative">
      <div className="relative overflow-hidden rounded-lg aspect-[3/4] youtube-shimmer">
        <div className="absolute top-2 md:top-3 right-2 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-full youtube-shimmer opacity-80" />
      </div>
      <div className="px-3 md:px-4 pb-4 md:pb-6 flex-1 flex flex-col">
        <div className="w-16 h-2.5 rounded-full youtube-shimmer mt-2 mb-1" />
        <div className="w-5/6 h-5 rounded-md youtube-shimmer mb-1" />
        <div className="w-1/2 h-4 rounded-md youtube-shimmer mb-3 md:mb-4" />
        <div className="mt-auto flex items-center justify-between">
          <div className="w-14 h-6 rounded-md youtube-shimmer" />
          <div className="w-20 h-8 rounded-lg youtube-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8, gridClassName = "" }) {
  return (
    <div
      className={
        gridClassName ||
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-9xl mx-auto"
      }
    >
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <main className="flex-grow pt-20 md:pt-28 pb-20 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full font-['Inter'] antialiased">
      <header className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 md:gap-6">
        <div>
          <div className="w-48 md:w-64 h-8 md:h-12 rounded-xl youtube-shimmer mb-3" />
          <div className="w-56 md:w-72 h-4 rounded-md youtube-shimmer" />
        </div>
        <div className="w-28 h-9 rounded-lg youtube-shimmer" />
      </header>

      <BookGridSkeleton count={8} gridClassName="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8" />
    </main>
  );
}

/**
 * Premium Empty State Component
 */
export function PremiumEmptyState({
  title = "Your wishlist is empty.",
  subtitle = "Start exploring books.",
  icon = "bookmark_add",
  actionText = "Start exploring books",
  actionLink = "/books",
  onActionClick = null,
}) {
  return (
    <div className="w-full py-12 md:py-20 flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 md:p-10 border border-[#e5e8ee] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#cce8e7] to-[#ebeef4] flex items-center justify-center mb-6 text-[#002629] shadow-inner">
          <span className="material-symbols-outlined text-3xl md:text-4xl text-[#002629]">
            {icon}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-[#002629] font-['Manrope'] mb-2 tracking-tight">
          {title}
        </h3>

        <p className="text-[#404849] font-medium text-sm md:text-base mb-8 max-w-xs leading-relaxed">
          {subtitle}
        </p>

        {actionLink ? (
          <a
            href={actionLink}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#002629] to-[#083d41] text-white font-bold font-['Manrope'] shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-center no-underline block"
          >
            {actionText}
          </a>
        ) : onActionClick ? (
          <button
            onClick={onActionClick}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#002629] to-[#083d41] text-white font-bold font-['Manrope'] shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            {actionText}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.04)] border-b border-slate-200/50">
      <nav className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 max-w-7xl mx-auto h-16 sm:h-20 gap-4">
        {/* 1. Left Logo Skeleton */}
        <div className="flex items-center shrink-0">
          <div className="w-28 sm:w-36 md:w-40 h-8 sm:h-10 rounded-lg youtube-shimmer" />
        </div>

        {/* 2. Center Links Skeleton */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10">
          <div className="w-14 h-5 rounded-md youtube-shimmer" />
          <div className="w-14 h-5 rounded-md youtube-shimmer" />
          <div className="w-16 h-5 rounded-md youtube-shimmer" />
        </div>

        {/* 3. Right Action Skeleton */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden lg:block w-44 xl:w-60 h-9 rounded-full youtube-shimmer" />
          <div className="w-9 h-9 rounded-full youtube-shimmer" />
          <div className="w-20 sm:w-24 h-9 rounded-full youtube-shimmer" />
        </div>
      </nav>
    </header>
  );
}

