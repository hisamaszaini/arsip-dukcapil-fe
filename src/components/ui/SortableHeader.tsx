import React from "react";

type SortOrder = "asc" | "desc";

interface SortableHeaderProps<T extends string> {
  children: React.ReactNode;
  columnKey: T;
  onSort: (sortKey: T) => void;
  queryParams: {
    sortBy?: T;
    sortOrder?: SortOrder;
  };
}

/**
 * Komponen header tabel yang bisa di-sort.
 * Generic agar bisa dipakai di tabel manapun.
 */
export const SortableHeader = <T extends string>({
  children,
  columnKey,
  onSort,
  queryParams,
}: SortableHeaderProps<T>) => {
  const renderSortIcon = () => {
    if (queryParams.sortBy !== columnKey) {
      return <span className="text-gray-400">⇅</span>;
    }
    if (queryParams.sortOrder === "asc") {
      return <span className="text-gray-500">▲</span>;
    }
    return <span className="text-gray-500">▼</span>;
  };

  return (
    <th
      className="px-6 py-4 text-left uppercase tracking-wider cursor-pointer select-none"
      onClick={() => onSort(columnKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        {renderSortIcon()}
      </div>
    </th>
  );
};
