import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Error"
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;