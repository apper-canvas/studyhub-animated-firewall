import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { toast } from "react-toastify";

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const { courses, createCourse, updateCourse, loading } = useCourses();
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    credits: "",
    semester: "",
    description: ""
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load course data for editing
  useEffect(() => {
    if (isEditing && courses.length > 0) {
      const course = courses.find(c => c.Id === parseInt(id));
      if (course) {
        setFormData({
          name: course.name || "",
          code: course.code || "",
          instructor: course.instructor || "",
          credits: course.credits?.toString() || "",
          semester: course.semester || "",
          description: course.description || ""
        });
      }
    }
  }, [isEditing, id, courses]);

  const semesterOptions = [
    { value: "", label: "Select Semester" },
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Fall 2023", label: "Fall 2023" },
    { value: "Spring 2025", label: "Spring 2025" }
  ];

  const creditOptions = [
    { value: "", label: "Select Credits" },
    { value: "1", label: "1 Credit" },
    { value: "2", label: "2 Credits" },
    { value: "3", label: "3 Credits" },
    { value: "4", label: "4 Credits" },
    { value: "5", label: "5 Credits" },
    { value: "6", label: "6 Credits" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    } else if (!/^[A-Z]{2,4}\s?\d{3,4}$/i.test(formData.code.trim())) {
      newErrors.code = "Course code format should be like 'CS 101' or 'MATH 2301'";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    if (!formData.credits) {
      newErrors.credits = "Credits is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setSubmitting(true);
    
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        currentGrade: isEditing ? 
          courses.find(c => c.Id === parseInt(id))?.currentGrade || 0 : 0
      };

      if (isEditing) {
        await updateCourse(id, courseData);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(courseData);
        toast.success("Course added successfully!");
      }
      
      navigate("/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} course`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCancel = () => {
    navigate("/courses");
  };

  return (
    <Layout title={isEditing ? "Edit Course" : "Add New Course"}>
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Course" : "Add New Course"}
              </h1>
              <p className="text-gray-600">
                {isEditing ? "Update course information" : "Create a new course to track your academic progress"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Course Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Introduction to Computer Science"
                error={errors.name}
                required
              />

              <Input
                label="Course Code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="e.g., CS 101"
                error={errors.code}
                required
              />
            </div>

            <Input
              label="Instructor"
              value={formData.instructor}
              onChange={(e) => handleChange("instructor", e.target.value)}
              placeholder="e.g., Dr. John Smith"
              error={errors.instructor}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Credits"
                value={formData.credits}
                onChange={(e) => handleChange("credits", e.target.value)}
                options={creditOptions}
                error={errors.credits}
                required
              />

              <Select
                label="Semester"
                value={formData.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
                options={semesterOptions}
                error={errors.semester}
                required
              />
            </div>

            <Textarea
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the course content and objectives..."
              rows={4}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting || loading}
                className="flex-1 sm:flex-initial"
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Course" : "Create Course"}
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 sm:flex-initial"
              >
                <ApperIcon name="X" className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex gap-3">
            <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Course Code Format Tips:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Use department abbreviation + number (e.g., CS 101, MATH 2301)</li>
                <li>• Most common formats: CS 101, ENGL 1301, HIST 2320</li>
                <li>• Both "CS101" and "CS 101" formats are accepted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseForm;