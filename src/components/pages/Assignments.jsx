import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { format, isPast, isToday, isTomorrow, isThisWeek } from "date-fns";
import { toast } from "react-toastify";

const Assignments = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses, loading: coursesLoading } = useCourses();
  const { 
    assignments, 
    loading: assignmentsLoading, 
    error: assignmentsError,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    loadAssignments
  } = useAssignments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "title", label: "Title" },
    { value: "course", label: "Course" },
    { value: "status", label: "Status" }
  ];

  const courseOptions = [
    { value: "", label: "All Courses" },
    ...courses.map(course => ({
      value: course.Id.toString(),
      label: `${course.name} (${course.code})`
    }))
  ];

  const handleAddAssignment = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const handleEditAssignment = (assignment) => {
    // For demo purposes, we'll show a toast
    toast.info("Edit functionality would open a modal here");
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

  // Filter and sort assignments
  const filteredAndSortedAssignments = React.useMemo(() => {
    let filtered = assignments.filter(assignment => {
      const course = getCourseById(assignment.courseId);
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (course && course.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCourse = !selectedCourse || assignment.courseId.toString() === selectedCourse;
      const matchesStatus = !selectedStatus || assignment.status === selectedStatus;
      const matchesPriority = !selectedPriority || assignment.priority === selectedPriority;
      
      return matchesSearch && matchesCourse && matchesStatus && matchesPriority;
    });

    // Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "title":
          return a.title.localeCompare(b.title);
        case "course":
          const courseA = getCourseById(a.courseId);
          const courseB = getCourseById(b.courseId);
          return (courseA?.name || "").localeCompare(courseB?.name || "");
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [assignments, courses, searchTerm, selectedCourse, selectedStatus, selectedPriority, sortBy]);

  // Calculate statistics
  const statistics = React.useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const pending = assignments.filter(a => a.status === "pending").length;
    const inProgress = assignments.filter(a => a.status === "in-progress").length;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate < new Date() && a.status !== "completed";
    }).length;
    const dueToday = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return isToday(dueDate) && a.status !== "completed";
    }).length;

    return { total, completed, pending, inProgress, overdue, dueToday };
  }, [assignments]);

  if (coursesLoading || assignmentsLoading) {
    return (
      <Layout title="Assignments" courses={courses} onAddAssignment={handleAddAssignment}>
        <Loading rows={4} />
      </Layout>
    );
  }

  if (assignmentsError) {
    return (
      <Layout title="Assignments" courses={courses} onAddAssignment={handleAddAssignment}>
        <Error 
          message="Failed to load assignments" 
          onRetry={loadAssignments}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Assignments" courses={courses} onAddAssignment={handleAddAssignment}>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statistics.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statistics.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statistics.inProgress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statistics.overdue}</p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{statistics.dueToday}</p>
              <p className="text-sm text-gray-600">Due Today</p>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Search assignments or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={courseOptions}
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={statusOptions}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              options={priorityOptions}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
          </div>
        </Card>

        {/* Assignments List */}
        {filteredAndSortedAssignments.length === 0 ? (
          assignments.length === 0 ? (
            <Empty
              title="No Assignments Yet"
              message="Start by adding your first assignment to stay on track."
              icon="FileText"
              action={() => toast.info("Use the Quick Add button in the header to add assignments")}
              actionLabel="Add Assignment"
            />
          ) : (
            <Empty
              title="No Assignments Found"
              message="No assignments match your current search criteria. Try adjusting your filters."
              icon="Search"
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredAndSortedAssignments.map(assignment => (
              <AssignmentItem
                key={assignment.Id}
                assignment={assignment}
                course={getCourseById(assignment.courseId)}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
                onToggleStatus={handleToggleAssignmentStatus}
              />
            ))}
          </div>
        )}

        {/* Quick Stats Summary */}
        {filteredAndSortedAssignments.length > 0 && (
          <Card className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="default">
                {filteredAndSortedAssignments.length} assignments shown
              </Badge>
              {selectedCourse && (
                <Badge variant="primary">
                  Course: {getCourseById(parseInt(selectedCourse))?.name}
                </Badge>
              )}
              {selectedStatus && (
                <Badge variant="secondary">
                  Status: {selectedStatus}
                </Badge>
              )}
              {selectedPriority && (
                <Badge variant="warning">
                  Priority: {selectedPriority}
                </Badge>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Assignments;