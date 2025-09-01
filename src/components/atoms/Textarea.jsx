import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className, 
  label,
  error,
  rows = 4,
  ...props 
}, ref) => {
  const textareaId = React.useId();
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "transition-colors duration-200 resize-vertical",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;