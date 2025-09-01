import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import QuickAddModal from "@/components/molecules/QuickAddModal";

const Header = ({ title, onMenuClick, courses = [], onAddAssignment }) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="p-2 lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuickAddOpen(true)}
              className="hidden sm:flex"
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuickAddOpen(true)}
              className="p-2 sm:hidden"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        courses={courses}
        onSubmit={onAddAssignment}
      />
    </>
  );
};

export default Header;