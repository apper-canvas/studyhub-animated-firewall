import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CourseCard = ({ course, onClick }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLetter = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  return (
    <Card hover className="p-6 cursor-pointer" onClick={() => onClick(course)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: course.color }}
            ></div>
            <h3 className="font-semibold text-lg text-gray-900">{course.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{course.code}</p>
          <p className="text-sm text-gray-500">{course.instructor}</p>
        </div>
        <div className="text-right">
          <div className={cn("text-2xl font-bold", getGradeColor(course.currentGrade))}>
            {getGradeLetter(course.currentGrade)}
          </div>
          <div className="text-sm text-gray-500">
            {course.currentGrade.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Credits</span>
          <span className="font-medium">{course.credits}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Semester</span>
          <span className="font-medium">{course.semester}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" className="h-4 w-4" />
<span>{course.schedule?.join(", ") || "No schedule available"}</span>
        </div>
        <Badge variant="default">
          {course.assignmentCount} assignments
        </Badge>
      </div>
    </Card>
  );
};

export default CourseCard;