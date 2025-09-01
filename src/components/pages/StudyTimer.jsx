import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { studySessionService } from "@/services/api/studySessionService";
import { useStudySessions } from "@/hooks/useStudySessions";
import { toast } from "react-toastify";
import { format } from "date-fns";

const StudyTimer = () => {
  const navigate = useNavigate();
  const { sessions, createSession, loadSessions } = useStudySessions();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Configuration
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  
  // Refs
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  
  // Timer presets
  const presets = [
    { study: 25, break: 5, name: "Classic Pomodoro" },
    { study: 50, break: 10, name: "Deep Focus" },
    { study: 15, break: 3, name: "Quick Sprint" },
    { study: 30, break: 5, name: "Balanced" }
  ];

  // Today's sessions for stats
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  });

  const todayStudyTime = todaySessions.reduce((total, session) => 
    total + (session.actualDuration || 0), 0);
  const todayCompletedSessions = todaySessions.filter(s => s.completed).length;

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = async () => {
    if (!isRunning) {
      // Create new session
      const sessionData = {
        type: isBreak ? 'break' : 'study',
        plannedDuration: isBreak ? breakDuration : studyDuration,
        startTime: new Date().toISOString(),
        completed: false
      };
      
      try {
        const newSession = await createSession(sessionData);
        setCurrentSession(newSession);
        setIsRunning(true);
        toast.info(`${isBreak ? 'Break' : 'Study'} session started!`);
      } catch (error) {
        toast.error('Failed to start session');
        return;
      }
    } else {
      setIsRunning(false);
      toast.info('Timer paused');
    }
  };

  // Stop timer
  const stopTimer = async () => {
    setIsRunning(false);
    
    if (currentSession) {
      try {
        const endTime = new Date();
        const startTime = new Date(currentSession.startTime);
        const actualDuration = Math.round((endTime - startTime) / 1000 / 60); // in minutes
        
        await studySessionService.update(currentSession.Id, {
          endTime: endTime.toISOString(),
          actualDuration,
          completed: false // Stopped early
        });
        
        setCurrentSession(null);
        toast.info('Session stopped');
        loadSessions(); // Refresh data
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
    
    // Reset timer
    setTimeLeft(isBreak ? breakDuration * 60 : studyDuration * 60);
  };

  // Complete session
  const completeSession = async () => {
    if (currentSession) {
      try {
        const endTime = new Date();
        const actualDuration = currentSession.plannedDuration;
        
        await studySessionService.update(currentSession.Id, {
          endTime: endTime.toISOString(),
          actualDuration,
          completed: true
        });
        
        setCurrentSession(null);
        loadSessions(); // Refresh data
        
        if (isBreak) {
          toast.success('Break completed! Ready to focus?');
          setIsBreak(false);
          setTimeLeft(studyDuration * 60);
        } else {
          toast.success('Study session completed! Time for a break.');
          setIsBreak(true);
          setTimeLeft(breakDuration * 60);
        }
      } catch (error) {
        toast.error('Failed to complete session');
      }
    }
    
    setIsRunning(false);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      completeSession();
      
      // Play notification sound (if available)
      if (audioRef.current) {
        audioRef.current.play().catch(() => {}); // Ignore if audio fails
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Apply preset
  const applyPreset = (preset) => {
    if (!isRunning) {
      setStudyDuration(preset.study);
      setBreakDuration(preset.break);
      setTimeLeft(preset.study * 60);
      setIsBreak(false);
      toast.info(`Applied ${preset.name} preset`);
    }
  };

  // Manual duration change
  const updateDuration = (type, value) => {
    if (!isRunning) {
      if (type === 'study') {
        setStudyDuration(value);
        if (!isBreak) setTimeLeft(value * 60);
      } else {
        setBreakDuration(value);
        if (isBreak) setTimeLeft(value * 60);
      }
    }
  };

  // Progress percentage
  const totalTime = isBreak ? breakDuration * 60 : studyDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Layout title="Study Timer">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Timer Display */}
        <Card className="p-8 text-center">
          <div className="space-y-6">
            {/* Session Type */}
            <div className="flex items-center justify-center gap-2">
              <ApperIcon 
                name={isBreak ? "Coffee" : "BookOpen"} 
                className={cn(
                  "h-6 w-6",
                  isBreak ? "text-green-500" : "text-blue-500"
                )}
              />
              <h2 className={cn(
                "text-2xl font-bold",
                isBreak ? "text-green-600" : "text-blue-600"
              )}>
                {isBreak ? "Break Time" : "Study Session"}
              </h2>
            </div>

            {/* Progress Circle */}
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className={cn(
                    "transition-all duration-1000 ease-linear",
                    isBreak ? "text-green-500" : "text-blue-500"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-mono font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isRunning ? "secondary" : "primary"}
                size="lg"
                onClick={startTimer}
                className="min-w-[120px]"
              >
                <ApperIcon 
                  name={isRunning ? "Pause" : "Play"} 
                  className="h-5 w-5 mr-2"
                />
                {isRunning ? "Pause" : "Start"}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={stopTimer}
                disabled={!currentSession}
              >
                <ApperIcon name="Square" className="h-5 w-5 mr-2" />
                Stop
              </Button>
            </div>

            {/* Current Session Info */}
            {currentSession && (
              <div className="text-sm text-gray-600">
                Session started at {format(new Date(currentSession.startTime), 'HH:mm')}
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ApperIcon name="Settings" className="h-5 w-5" />
              Timer Settings
            </h3>
            
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      disabled={isRunning}
                      className="text-xs"
                    >
                      {preset.name}
                      <br />
                      <span className="text-gray-500">
                        {preset.study}/{preset.break}min
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Study (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={studyDuration}
                    onChange={(e) => updateDuration('study', parseInt(e.target.value))}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={breakDuration}
                    onChange={(e) => updateDuration('break', parseInt(e.target.value))}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Today's Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" className="h-5 w-5" />
              Today's Progress
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Study Time</span>
                <span className="font-semibold text-blue-600">
                  {Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Sessions</span>
                <span className="font-semibold text-green-600">
                  {todayCompletedSessions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-semibold text-gray-700">
                  {todaySessions.length}
                </span>
              </div>

              {todaySessions.length > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((todayStudyTime / 480) * 100, 100)}%` // 8 hours target
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Goal: 8 hours daily
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ApperIcon name="History" className="h-5 w-5" />
              Recent Sessions
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessions.slice(0, 10).map((session) => (
                <div key={session.Id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ApperIcon 
                      name={session.type === 'break' ? "Coffee" : "BookOpen"}
                      className={cn(
                        "h-4 w-4",
                        session.type === 'break' ? "text-green-500" : "text-blue-500"
                      )}
                    />
                    <div>
                      <div className="text-sm font-medium capitalize">
                        {session.type} Session
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(session.startTime), 'MMM d, HH:mm')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {session.actualDuration || session.plannedDuration}min
                    </div>
                    <div className={cn(
                      "text-xs",
                      session.completed ? "text-green-600" : "text-gray-500"
                    )}>
                      {session.completed ? "Completed" : "Incomplete"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Hidden audio element for notifications */}
        <audio
          ref={audioRef}
          preload="auto"
        >
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSwFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsFJXfH8N2QQAoUXrTp66hVFApGn+DyvmwhDFaoxvHOeSsF" type="audio/wav" />
        </audio>
      </div>
    </Layout>
  );
};

export default StudyTimer;