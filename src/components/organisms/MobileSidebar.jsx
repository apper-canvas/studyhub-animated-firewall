import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const MobileSidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 lg:hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text">StudyHub</h1>
                    <p className="text-xs text-gray-500">Academic Manager</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
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
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <ApperIcon name="Target" className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900">Study Goal</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">Maintain a 3.5+ GPA this semester</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current: 3.4 GPA</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;