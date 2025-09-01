import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg col-span-2"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg col-span-1"></div>
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;