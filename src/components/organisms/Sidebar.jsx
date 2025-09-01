import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full", className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">StudyHub</h1>
            <p className="text-xs text-gray-500">Academic Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
    </div>
  );
};

export default Sidebar;