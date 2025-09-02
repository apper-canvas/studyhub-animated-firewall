import coursesData from "@/services/mockData/courses.json";

// Mock service implementation - will be replaced with ApperClient when database tables are available
const courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced service for authentication integration
export const courseService = {
  async getAll() {
    await delay(300);
    // Future: Replace with ApperClient.fetchRecords('course_c', {fields: [...]})
    try {
      return [...courses];
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new Error("Failed to load courses");
    }
  },

  async getById(id) {
    await delay(200);
    // Future: Replace with ApperClient.getRecordById('course_c', id, {fields: [...]})
    try {
      const course = courses.find(c => c.Id === parseInt(id));
      return course ? { ...course } : null;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw new Error("Failed to load course");
    }
  },

  async create(courseData) {
    await delay(400);
    // Future: Replace with ApperClient.createRecord('course_c', {records: [...]})
    try {
      const newCourse = {
        ...courseData,
        Id: Math.max(...courses.map(c => c.Id)) + 1,
        currentGrade: 0,
        assignmentCount: 0
      };
      courses.push(newCourse);
      return { ...newCourse };
    } catch (error) {
      console.error("Error creating course:", error);
      throw new Error("Failed to create course");
    }
  },

  async update(id, courseData) {
    await delay(300);
    // Future: Replace with ApperClient.updateRecord('course_c', {records: [...]})
    try {
      const index = courses.findIndex(c => c.Id === parseInt(id));
      if (index !== -1) {
        courses[index] = { ...courses[index], ...courseData };
        return { ...courses[index] };
      }
      return null;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw new Error("Failed to update course");
    }
  },

  async delete(id) {
    await delay(200);
    // Future: Replace with ApperClient.deleteRecord('course_c', {RecordIds: [id]})
    try {
      const index = courses.findIndex(c => c.Id === parseInt(id));
      if (index !== -1) {
        courses.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw new Error("Failed to delete course");
    }
  }
};

// Migration Notes:
// When database tables become available, replace service methods with:
// - ApperClient initialization with project ID and public key
// - ApperClient.fetchRecords for getAll()
// - ApperClient.getRecordById for getById()
// - ApperClient.createRecord for create()
// - ApperClient.updateRecord for update()
// - ApperClient.deleteRecord for delete()