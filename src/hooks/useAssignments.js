import { useState, useEffect } from "react";
import { assignmentService } from "@/services/api/assignmentService";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      console.error("Error creating assignment:", err);
      throw err;
    }
  };

  const updateAssignment = async (id, assignmentData) => {
    try {
      const updatedAssignment = await assignmentService.update(id, assignmentData);
      if (updatedAssignment) {
        setAssignments(prev => 
          prev.map(a => a.Id === parseInt(id) ? updatedAssignment : a)
        );
      }
      return updatedAssignment;
    } catch (err) {
      console.error("Error updating assignment:", err);
      throw err;
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const success = await assignmentService.delete(id);
      if (success) {
        setAssignments(prev => prev.filter(a => a.Id !== parseInt(id)));
      }
      return success;
    } catch (err) {
      console.error("Error deleting assignment:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
    loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
};