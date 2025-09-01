import React, { useMemo } from "react";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCourses } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { useGrades } from "@/hooks/useGrades";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const Grades = () => {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { assignments, createAssignment } = useAssignments();
  const { grades, loading: gradesLoading, error: gradesError, loadGrades } = useGrades();

  const handleAddAssignment = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      toast.success("Assignment added successfully!");
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  const gradeData = useMemo(() => {
    if (coursesLoading || gradesLoading) return null;

    // Calculate overall GPA
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + (course.currentGrade / 100) * 4 * course.credits;
    }, 0);
    const overallGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    // Prepare course grade breakdown
    const courseBreakdown = courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.Id && a.grade !== null);
      const gradeDistribution = {
        A: courseAssignments.filter(a => a.grade >= 90).length,
        B: courseAssignments.filter(a => a.grade >= 80 && a.grade < 90).length,
        C: courseAssignments.filter(a => a.grade >= 70 && a.grade < 80).length,
        D: courseAssignments.filter(a => a.grade >= 60 && a.grade < 70).length,
        F: courseAssignments.filter(a => a.grade < 60).length,
      };

      return {
        ...course,
        assignmentCount: courseAssignments.length,
        gradeDistribution
      };
    });

    // Grade trend data (mock data for demonstration)
    const trendData = [
      { month: "Aug", gpa: 3.2 },
      { month: "Sep", gpa: 3.4 },
      { month: "Oct", gpa: 3.3 },
      { month: "Nov", gpa: 3.5 },
      { month: "Dec", gpa: overallGPA },
    ];

    return {
      overallGPA: overallGPA.toFixed(2),
      totalCredits,
      courseBreakdown,
      trendData
    };
  }, [courses, grades, assignments, coursesLoading, gradesLoading]);

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      background: "transparent"
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#2563eb"],
    xaxis: {
      categories: gradeData?.trendData.map(d => d.month) || [],
      labels: {
        style: {
          colors: "#6b7280"
        }
      }
    },
    yaxis: {
      min: 0,
      max: 4,
      labels: {
        style: {
          colors: "#6b7280"
        }
      }
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 5
    },
    tooltip: {
      theme: "light"
    }
  };

  const chartSeries = [{
    name: "GPA",
    data: gradeData?.trendData.map(d => d.gpa) || []
  }];

  if (coursesLoading || gradesLoading) {
    return (
      <Layout title="Grades" courses={courses} onAddAssignment={handleAddAssignment}>
        <Loading rows={3} />
      </Layout>
    );
  }

  if (coursesError || gradesError) {
    return (
      <Layout title="Grades" courses={courses} onAddAssignment={handleAddAssignment}>
        <Error 
          message="Failed to load grade data" 
          onRetry={() => {
            loadGrades();
            window.location.reload();
          }}
        />
      </Layout>
    );
  }

  if (!gradeData) {
    return (
      <Layout title="Grades" courses={courses} onAddAssignment={handleAddAssignment}>
        <Empty 
          title="No Grade Data Available" 
          message="Start by completing some assignments to see your grades." 
        />
      </Layout>
    );
  }

  return (
    <Layout title="Grades" courses={courses} onAddAssignment={handleAddAssignment}>
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overall GPA</p>
                <p className="text-3xl font-bold text-gray-900">{gradeData.overallGPA}</p>
                <p className="text-sm text-gray-500">out of 4.0</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Award" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-gray-900">{gradeData.totalCredits}</p>
                <p className="text-sm text-gray-500">credit hours</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-sm text-gray-500">active courses</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* GPA Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">GPA Trend</h2>
            <Badge variant="primary">Current Semester</Badge>
          </div>
          <div className="h-64">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height="100%"
            />
          </div>
        </Card>

        {/* Course Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Breakdown</h2>
            <Badge variant="default">{courses.length} courses</Badge>
          </div>
          
          <div className="space-y-4">
            {gradeData.courseBreakdown.map(course => (
              <div key={course.Id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: course.color }}
                    ></div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.code} • {course.credits} credits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getGradeColor(course.currentGrade)}`}>
                      {getGradeLetter(course.currentGrade)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.currentGrade.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-green-50 rounded p-2">
                    <div className="font-semibold text-green-700">{course.gradeDistribution.A}</div>
                    <div className="text-green-600">A's</div>
                  </div>
                  <div className="bg-blue-50 rounded p-2">
                    <div className="font-semibold text-blue-700">{course.gradeDistribution.B}</div>
                    <div className="text-blue-600">B's</div>
                  </div>
                  <div className="bg-yellow-50 rounded p-2">
                    <div className="font-semibold text-yellow-700">{course.gradeDistribution.C}</div>
                    <div className="text-yellow-600">C's</div>
                  </div>
                  <div className="bg-orange-50 rounded p-2">
                    <div className="font-semibold text-orange-700">{course.gradeDistribution.D}</div>
                    <div className="text-orange-600">D's</div>
                  </div>
                  <div className="bg-red-50 rounded p-2">
                    <div className="font-semibold text-red-700">{course.gradeDistribution.F}</div>
                    <div className="text-red-600">F's</div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span>{course.assignmentCount} graded assignments</span>
                  <span>{course.instructor}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Grade Calculator */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">GPA Calculator</h2>
            <Badge variant="info">What If Analysis</Badge>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="text-center">
              <ApperIcon name="Calculator" className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grade Calculator</h3>
              <p className="text-gray-600 mb-4">
                Plan your semester and see how different grades will affect your GPA
              </p>
              <p className="text-sm text-gray-500">
                Feature coming soon - calculate what grades you need to reach your target GPA
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Grades;