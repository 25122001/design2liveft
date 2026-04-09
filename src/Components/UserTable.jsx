import React from "react";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";

function UserTable({
  users = [],
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const safeTotalPages = totalPages || 1;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < safeTotalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Phone
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Aadhar
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Portion
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                working
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                Created
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {u.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-white">{u.email}</td>

                  <td className="px-6 py-4 text-sm text-white">{u.phone}</td>

                  <td className="px-6 py-4 text-sm text-white">{u.aadhar}</td>

                  <td className="px-6 py-4 text-sm text-white">{u.portion}</td>
                  <td className="px-6 py-4 text-sm text-white">{u.working}</td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.status === "active"
                          ? "bg-yellow-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(u)}
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-400 transition-all font-semibold"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(u._id)}
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-400 transition-all font-semibold"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center bg-gray-800">
        <div className="text-sm text-gray-400">
          Page {currentPage} of {safeTotalPages}
        </div>

        <div className="flex gap-2">
          {/* Prev Button */}
          <button
            disabled={currentPage <= 1}
            onClick={handlePrev}
            type="button"
            className={`flex items-center gap-1 px-3 py-2 border rounded-lg transition
      ${
        currentPage > 1
          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
          : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
      }`}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          {/* Current Page */}
          <button
            type="button"
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white"
          >
            {currentPage}
          </button>

          {/* Next Button */}
          <button
            disabled={currentPage >= safeTotalPages}
            onClick={handleNext}
            type="button"
            className={`flex items-center gap-1 px-3 py-2 border rounded-lg transition
      ${
        currentPage < safeTotalPages
          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500"
          : "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
      }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
