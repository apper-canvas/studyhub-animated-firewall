import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const QuickAddModal = ({ isOpen, onClose, courses, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    description: ""
  });

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: `${course.name} (${course.code})`
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.courseId || !formData.dueDate) return;
    
    onSubmit({
      ...formData,
      courseId: parseInt(formData.courseId),
      status: "pending",
      grade: null,
      weight: 1
    });
    
    setFormData({
      title: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      description: ""
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Assignment
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Assignment Title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter assignment title"
                  required
                />
                
                <Select
                  label="Course"
                  value={formData.courseId}
                  onChange={(e) => handleChange("courseId", e.target.value)}
                  options={courseOptions}
                  placeholder="Select a course"
                  required
                />
                
                <Input
                  label="Due Date"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  required
                />
                
                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  options={priorityOptions}
                />
                
                <Textarea
                  label="Description (Optional)"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter assignment description"
                  rows={3}
                />
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={!formData.title || !formData.courseId || !formData.dueDate}
                  >
                    Add Assignment
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default QuickAddModal;