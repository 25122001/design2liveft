import React from "react";

function StatusCard({ title, value, icon, color }) {
  return (
    <div className={`p-5 rounded-xl shadow-md text-white ${color || "bg-gray-800"}`}>
      <div className="flex items-center justify-between">
        
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        <div className="text-3xl opacity-80">
          {icon ? icon : null}
        </div>

      </div>
    </div>
  );
}

export default StatusCard;