import { useState, useEffect } from "react";
import { studySessionService } from "@/services/api/studySessionService";

export const useStudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studySessionService.getAll();
      setSessions(data);
    } catch (err) {
      setError("Failed to load study sessions");
      console.error("Error loading study sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData) => {
    try {
      const newSession = await studySessionService.create(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      console.error("Error creating study session:", err);
      throw err;
    }
  };

  const updateSession = async (id, sessionData) => {
    try {
      const updatedSession = await studySessionService.update(id, sessionData);
      if (updatedSession) {
        setSessions(prev => 
          prev.map(s => s.Id === parseInt(id) ? updatedSession : s)
        );
      }
      return updatedSession;
    } catch (err) {
      console.error("Error updating study session:", err);
      throw err;
    }
  };

  const deleteSession = async (id) => {
    try {
      const success = await studySessionService.delete(id);
      if (success) {
        setSessions(prev => prev.filter(s => s.Id !== parseInt(id)));
      }
      return success;
    } catch (err) {
      console.error("Error deleting study session:", err);
      throw err;
    }
  };

  const getTodaySessions = () => {
    const today = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === today.toDateString();
    });
  };

  const getStudyStats = () => {
    const today = new Date();
    const todaySessions = getTodaySessions();
    
    const totalStudyTime = todaySessions
      .filter(s => s.type === 'study')
      .reduce((total, session) => total + (session.actualDuration || 0), 0);
    
    const completedSessions = todaySessions.filter(s => s.completed && s.type === 'study').length;
    
    return {
      todayStudyTime: totalStudyTime,
      todayCompletedSessions: completedSessions,
      todayTotalSessions: todaySessions.filter(s => s.type === 'study').length
    };
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    loading,
    error,
    loadSessions,
    createSession,
    updateSession,
    deleteSession,
    getTodaySessions,
    getStudyStats
  };
};