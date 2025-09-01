import React, { useState, useMemo } from "react";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  parseISO
} from "date-fns";
import { toast } from "react-toastify";

const Calendar = () => {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { 
    assignments, 
    loading: assignmentsLoading, 
    error: assignmentsError,
    createAssignment,
    loadAssignments
  } = useAssignments();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month or week

  const handleAddAssignment = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  // Get assignments for a specific date
  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => {
      const dueDate = parseISO(assignment.dueDate);
      return isSameDay(dueDate, date);
    });
  };

  // Get assignments for selected date details
  const selectedDateAssignments = useMemo(() => {
    return getAssignmentsForDate(selectedDate).map(assignment => ({
      ...assignment,
      course: getCourseById(assignment.courseId)
    }));
  }, [selectedDate, assignments, courses]);

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  if (coursesLoading || assignmentsLoading) {
    return (
      <Layout title="Calendar" courses={courses} onAddAssignment={handleAddAssignment}>
        <Loading rows={3} />
      </Layout>
    );
  }

  if (coursesError || assignmentsError) {
    return (
      <Layout title="Calendar" courses={courses} onAddAssignment={handleAddAssignment}>
        <Error 
          message="Failed to load calendar data" 
          onRetry={() => {
            loadAssignments();
            window.location.reload();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Calendar" courses={courses} onAddAssignment={handleAddAssignment}>
      <div className="space-y-6">
        {/* Calendar Header */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                >
                  <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900 min-w-[160px] text-center">
                  {format(currentDate, "MMMM yyyy")}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                >
                  <ApperIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "month" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Calendar Header - Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-3 text-sm font-medium text-gray-600 text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayAssignments = getAssignmentsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isDayToday = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <div
                      key={index}
                      className={`
                        min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
                        ${!isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
                        ${isDayToday ? "bg-blue-50 border-blue-200" : ""}
                        ${isSelected ? "bg-primary-50 border-primary-300" : ""}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`
                        text-sm font-medium mb-1
                        ${isDayToday ? "text-blue-600" : ""}
                        ${isSelected ? "text-primary-600" : ""}
                      `}>
                        {format(day, "d")}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAssignments.slice(0, 2).map(assignment => {
                          const course = getCourseById(assignment.courseId);
                          return (
                            <div
                              key={assignment.Id}
                              className="text-xs p-1 rounded"
                              style={{ 
                                backgroundColor: course?.color + "20", 
                                color: course?.color,
                                borderLeft: `3px solid ${course?.color}`
                              }}
                            >
                              {assignment.title}
                            </div>
                          );
                        })}
                        {dayAssignments.length > 2 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayAssignments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">
                  {format(selectedDate, "EEEE, MMM d")}
                </h3>
              </div>
              
              {selectedDateAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CalendarX" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No assignments due</p>
                  <p className="text-gray-500 text-xs">Enjoy your free day!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAssignments.map(assignment => (
                    <div
                      key={assignment.Id}
                      className="p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: assignment.course?.color }}
                        ></div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {assignment.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {assignment.course?.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={assignment.priority} className="text-xs">
                          {assignment.priority}
                        </Badge>
                        <Badge variant={assignment.status} className="text-xs">
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Due: {format(parseISO(assignment.dueDate), "h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Assignments</span>
                  <span className="font-medium">
                    {assignments.filter(a => {
                      const dueDate = parseISO(a.dueDate);
                      return isSameMonth(dueDate, currentDate);
                    }).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {assignments.filter(a => {
                      const dueDate = parseISO(a.dueDate);
                      return isSameMonth(dueDate, currentDate) && a.status === "completed";
                    }).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-medium text-blue-600">
                    {assignments.filter(a => {
                      const dueDate = parseISO(a.dueDate);
                      return isSameMonth(dueDate, currentDate) && 
                             a.status !== "completed" && 
                             dueDate > new Date();
                    }).length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Course Legend */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Course Colors</h3>
              <div className="space-y-2">
                {courses.slice(0, 5).map(course => (
                  <div key={course.Id} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course.color }}
                    ></div>
                    <span className="text-gray-700">{course.code}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;