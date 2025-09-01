import { useState, useEffect } from "react";
import { courseService } from "@/services/api/courseService";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
    try {
      const newCourse = await courseService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      console.error("Error creating course:", err);
      throw err;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const updatedCourse = await courseService.update(id, courseData);
      if (updatedCourse) {
        setCourses(prev => 
          prev.map(c => c.Id === parseInt(id) ? updatedCourse : c)
        );
      }
      return updatedCourse;
    } catch (err) {
      console.error("Error updating course:", err);
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const success = await courseService.delete(id);
      if (success) {
        setCourses(prev => prev.filter(c => c.Id !== parseInt(id)));
      }
      return success;
    } catch (err) {
      console.error("Error deleting course:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse
  };
};