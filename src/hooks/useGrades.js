import { useState, useEffect } from "react";
import { gradeService } from "@/services/api/gradeService";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (err) {
      setError("Failed to load grades");
      console.error("Error loading grades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  return {
    grades,
    loading,
    error,
    loadGrades
  };
};