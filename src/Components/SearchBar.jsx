import React from "react";
import { Search, X } from "lucide-react";

function SearchBar({
  value,
  onChange,
  onClear,
  itemsPerPage,
  onItemsPerPageChange,
  currentPage,
  totalUsers,
}) {
    
  const safePage = Number(currentPage) || 1;
const safeItemsPerPage = Number(itemsPerPage) || 5;
const safeTotalUsers = Number(totalUsers) || 0;

const startUser =
  safeTotalUsers === 0 ? 0 : (safePage - 1) * safeItemsPerPage + 1;

const endUser = Math.min(safePage * safeItemsPerPage, safeTotalUsers);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* Search Section */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tenants info ..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1 transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Pagination Info & Rows Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
Showing {totalUsers === 0 ? 0 : startUser} to {endUser} of {totalUsers} tenants        </span>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Rows</label>

          <select
  value={itemsPerPage}
  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
  className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={25}>25</option>
  <option value={50}>50</option>
  <option value={100}>100</option>
</select>
        </div>




      </div>
    </div>
  );
}

export default SearchBar;