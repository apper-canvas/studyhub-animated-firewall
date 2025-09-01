import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import StatCard from "@/components/molecules/StatCard";
import CourseCard from "@/components/molecules/CourseCard";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { 
    assignments, 
    loading: assignmentsLoading, 
    error: assignmentsError,
    createAssignment,
    updateAssignment,
    deleteAssignment
  } = useAssignments();

  const dashboardData = useMemo(() => {
    if (coursesLoading || assignmentsLoading) return null;

    const totalCourses = courses.length;
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    
    // Calculate GPA
    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + (course.currentGrade / 100) * 4 * course.credits;
    }, 0);
    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    // Get today's assignments
    const todaysAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return isToday(dueDate) && assignment.status !== "completed";
    });

    // Get upcoming assignments (this week)
    const upcomingAssignments = assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return isThisWeek(dueDate) && assignment.status !== "completed";
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    // Get overdue assignments
    const overdueAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate < new Date() && assignment.status !== "completed";
    });

    return {
      totalCourses,
      totalCredits,
      gpa: gpa.toFixed(2),
      todaysAssignments,
      upcomingAssignments,
      overdueCount: overdueAssignments.length
    };
  }, [courses, assignments, coursesLoading, assignmentsLoading]);

  const handleAddAssignment = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const handleToggleAssignmentStatus = async (assignment) => {
    try {
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      await updateAssignment(assignment.Id, { status: newStatus });
      toast.success(`Assignment ${newStatus === "completed" ? "completed" : "reopened"}!`);
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id);
        toast.success("Assignment deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  if (coursesLoading || assignmentsLoading) {
    return (
      <Layout title="Dashboard">
        <div className="space-y-6">
          <Loading rows={4} />
        </div>
      </Layout>
    );
  }

  if (coursesError || assignmentsError) {
    return (
      <Layout title="Dashboard">
        <Error 
          message="Failed to load dashboard data" 
          onRetry={() => window.location.reload()} 
        />
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout title="Dashboard">
        <Empty 
          title="No Data Available" 
          message="Start by adding your courses and assignments." 
        />
      </Layout>
    );
  }

  return (
    <Layout 
      title="Dashboard" 
      courses={courses}
      onAddAssignment={handleAddAssignment}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current GPA"
            value={dashboardData.gpa}
            icon="Award"
            color="primary"
            trend={parseFloat(dashboardData.gpa) >= 3.5 ? "up" : "down"}
            trendValue={`Target: 3.5`}
            onClick={() => navigate("/grades")}
          />
          
          <StatCard
            title="Active Courses"
            value={dashboardData.totalCourses}
            icon="BookOpen"
            color="secondary"
            onClick={() => navigate("/courses")}
          />
          
          <StatCard
            title="Total Credits"
            value={dashboardData.totalCredits}
            icon="GraduationCap"
            color="success"
          />
          
          <StatCard
            title="Due Today"
            value={dashboardData.todaysAssignments.length}
            icon="Calendar"
            color={dashboardData.todaysAssignments.length > 0 ? "warning" : "success"}
            onClick={() => navigate("/assignments")}
          />
        </div>

        {/* Overdue Alert */}
        {dashboardData.overdueCount > 0 && (
          <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-3">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">
                  You have {dashboardData.overdueCount} overdue assignment{dashboardData.overdueCount > 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-red-700">
                  Review your assignments and catch up on missed deadlines.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/assignments")}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                View All
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Due Today</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/assignments")}
              >
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {dashboardData.todaysAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle2" className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">No assignments due today!</p>
                  <p className="text-sm text-gray-500">You're all caught up.</p>
                </div>
              ) : (
                dashboardData.todaysAssignments.map(assignment => (
                  <AssignmentItem
                    key={assignment.Id}
                    assignment={assignment}
                    course={getCourseById(assignment.courseId)}
                    onEdit={(assignment) => navigate(`/assignments?edit=${assignment.Id}`)}
                    onDelete={handleDeleteAssignment}
                    onToggleStatus={handleToggleAssignmentStatus}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming This Week</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/assignments")}
              >
                View All
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {dashboardData.upcomingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No upcoming assignments</p>
                  <p className="text-sm text-gray-500">Your week looks clear!</p>
                </div>
              ) : (
                dashboardData.upcomingAssignments.map(assignment => (
                  <AssignmentItem
                    key={assignment.Id}
                    assignment={assignment}
                    course={getCourseById(assignment.courseId)}
                    onEdit={(assignment) => navigate(`/assignments?edit=${assignment.Id}`)}
                    onDelete={handleDeleteAssignment}
                    onToggleStatus={handleToggleAssignmentStatus}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recent Courses */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/courses")}
            >
              View All
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map(course => (
              <CourseCard
                key={course.Id}
                course={course}
                onClick={() => navigate(`/courses/${course.Id}`)}
              />
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;