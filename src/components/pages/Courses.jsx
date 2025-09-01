import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { toast } from "react-toastify";

const Courses = () => {
  const navigate = useNavigate();
  const { courses, loading: coursesLoading, error: coursesError, loadCourses } = useCourses();
  const { 
    assignments, 
    createAssignment
  } = useAssignments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const semesterOptions = [
    { value: "", label: "All Semesters" },
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" }
  ];

  const sortOptions = [
    { value: "name", label: "Course Name" },
    { value: "code", label: "Course Code" },
    { value: "grade", label: "Current Grade" },
    { value: "credits", label: "Credits" }
  ];

  const handleAddAssignment = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.Id}`);
  };

  // Filter and sort courses
  const filteredAndSortedCourses = React.useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = !selectedSemester || course.semester === selectedSemester;
      return matchesSearch && matchesSemester;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "grade":
          return b.currentGrade - a.currentGrade;
        case "credits":
          return b.credits - a.credits;
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedSemester, sortBy]);

  // Calculate statistics
  const statistics = React.useMemo(() => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + (course.currentGrade / 100) * 4 * course.credits;
    }, 0);
    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    const averageGrade = courses.length > 0 
      ? courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length 
      : 0;

    return {
      totalCourses: courses.length,
      totalCredits,
      gpa: gpa.toFixed(2),
      averageGrade: averageGrade.toFixed(1)
    };
  }, [courses]);

  if (coursesLoading) {
    return (
      <Layout title="Courses" courses={courses} onAddAssignment={handleAddAssignment}>
        <Loading rows={3} />
      </Layout>
    );
  }

  if (coursesError) {
    return (
      <Layout title="Courses" courses={courses} onAddAssignment={handleAddAssignment}>
        <Error 
          message="Failed to load courses" 
          onRetry={loadCourses}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Courses" courses={courses} onAddAssignment={handleAddAssignment}>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xl font-bold text-gray-900">{statistics.totalCourses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-xl font-bold text-gray-900">{statistics.totalCredits}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Award" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current GPA</p>
                <p className="text-xl font-bold text-gray-900">{statistics.gpa}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Grade</p>
                <p className="text-xl font-bold text-gray-900">{statistics.averageGrade}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses by name, code, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                options={semesterOptions}
                className="min-w-[150px]"
              />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                className="min-w-[150px]"
              />
            </div>
          </div>
        </Card>

        {/* Course Grid */}
        {filteredAndSortedCourses.length === 0 ? (
          courses.length === 0 ? (
            <Empty
              title="No Courses Yet"
              message="Start by adding your first course to track your academic progress."
              icon="BookOpen"
              action={() => navigate("/courses/new")}
              actionLabel="Add Course"
            />
          ) : (
            <Empty
              title="No Courses Found"
              message="No courses match your current search criteria. Try adjusting your filters."
              icon="Search"
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCourses.map(course => (
              <CourseCard
                key={course.Id}
                course={course}
                onClick={handleCourseClick}
              />
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/courses/new")}
            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
            Add Course
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;