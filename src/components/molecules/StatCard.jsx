import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  onClick 
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600",
  };

  return (
    <Card 
      hover={!!onClick} 
      className={cn("p-6", onClick && "cursor-pointer")}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4",
                  trend === "up" ? "text-green-500" : "text-red-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;