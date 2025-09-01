import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, isPast, isToday, isTomorrow } from "date-fns";

const AssignmentItem = ({ assignment, course, onEdit, onDelete, onToggleStatus }) => {
  const getDueDateDisplay = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Due Today";
    if (isTomorrow(date)) return "Due Tomorrow";
    if (isPast(date)) return "Overdue";
    return `Due ${format(date, "MMM d")}`;
  };

  const getDueDateVariant = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && assignment.status !== "completed") return "overdue";
    if (isToday(date)) return "warning";
    return "default";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed": return "completed";
      case "in-progress": return "warning";
      default: return "pending";
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.color }}
            ></div>
            <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
            <Badge variant={getStatusVariant(assignment.status)}>
              {assignment.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{course.name}</p>
          
          {assignment.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            <Badge variant={getDueDateVariant(assignment.dueDate)}>
              <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
              {getDueDateDisplay(assignment.dueDate)}
            </Badge>
            
            <Badge variant={assignment.priority}>
              <ApperIcon name="AlertCircle" className="h-3 w-3 mr-1" />
              {assignment.priority} priority
            </Badge>
            
            {assignment.grade !== null && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Award" className="h-3 w-3 text-gray-500" />
                <span className="text-gray-700 font-medium">
                  {assignment.grade}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleStatus(assignment)}
            title={assignment.status === "completed" ? "Mark as pending" : "Mark as completed"}
          >
            <ApperIcon 
              name={assignment.status === "completed" ? "CheckCircle2" : "Circle"} 
              className="h-4 w-4" 
            />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(assignment)}
            title="Edit assignment"
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(assignment.Id)}
            title="Delete assignment"
          >
            <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssignmentItem;