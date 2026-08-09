'use client';

import React from 'react';

interface FolderTabShapeProps {
  fill: string;
  className?: string;
}

/**
 * Exact folder-tab silhouette: a raised tab (top-left) that cuts
 * diagonally down into the main rounded-rect body, matching the
 * reference geometry pixel-for-pixel. viewBox is tightly cropped to
 * the shape itself (no dead space), so it can sit as an absolute
 * inset-0 background layer inside any content-sized card and stretch
 * to fit — the tab occupies roughly the top ~17% of whatever height
 * the real content ends up establishing.
 */
export function FolderTabShape({ fill, className = "" }: FolderTabShapeProps) {
  return (
    <svg
      viewBox="0 0 474 407"
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <path
        d="
          M 0 40
          A 40 40 0 0 1 40 0
          L 177 0
          Q 185 0 190 6
          L 245 62
          Q 251 68 259 68
          L 444 68
          A 30 30 0 0 1 474 98
          L 474 383
          A 24 24 0 0 1 450 407
          L 24 407
          A 24 24 0 0 1 0 383
          Z
        "
        fill={fill}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE FOLDER TAB CARD — fully responsive & font-integrated
   ═══════════════════════════════════════════════════════════════ */

interface FolderTabCardProps {
  children: React.ReactNode;
  tabLabel?: string;
  fill?: string;
  className?: string;
  contentClassName?: string;
}

export function FolderTabCard({
  children,
  tabLabel,
  fill = '#1A2238',
  className = '',
  contentClassName = '',
}: FolderTabCardProps) {
  return (
    <div
      className={`relative w-full transition-all duration-300 ${className}`}
      style={{ fontFamily: "var(--font-rubik), 'Rubik', sans-serif" }}
    >
      {/* SVG Background Shape - stretches responsively */}
      <FolderTabShape fill={fill} className="drop-shadow-md" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Tab Label Area — sits in the raised tab portion with responsive padding */}
        {tabLabel && (
          <div className="px-4 sm:px-6 pt-2.5 sm:pt-3.5 pb-1">
            <span
              className="text-[9px] sm:text-xs font-bold tracking-wider uppercase text-gray-400 select-none block truncate"
              style={{ fontFamily: "var(--font-libre-franklin), 'Libre Franklin', sans-serif" }}
            >
              {tabLabel}
            </span>
          </div>
        )}

        {/* Main Content — fully responsive padding for mobile & desktop */}
        <div className={`px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 flex-1 flex flex-col ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default FolderTabShape;