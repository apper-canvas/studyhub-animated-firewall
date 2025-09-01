import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  className, 
  message = "No data available", 
  action,
  actionLabel = "Add New",
  icon = "Inbox",
  title = "No Items Found"
}) => {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <Button onClick={action} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;