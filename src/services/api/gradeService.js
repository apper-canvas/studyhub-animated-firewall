import gradesData from "@/services/mockData/grades.json";
// Mock service implementation - will be replaced with ApperClient when database tables are available
const grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced service for authentication integration
export const gradeService = {
  async getAll() {
    await delay(300);
    // Future: Replace with ApperClient.fetchRecords('grade_c', {fields: [...]})
    try {
      return [...grades];
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw new Error("Failed to load grades");
    }
  },

  async getById(id) {
    await delay(200);
    // Future: Replace with ApperClient.getRecordById('grade_c', id, {fields: [...]})
    try {
      const grade = grades.find(g => g.Id === parseInt(id));
      return grade ? { ...grade } : null;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error);
      throw new Error("Failed to load grade");
    }
  },

  async getByCourse(courseId) {
    await delay(300);
    // Future: Replace with ApperClient.fetchRecords with where clause for courseId
    try {
      return grades.filter(g => g.courseId === parseInt(courseId));
    } catch (error) {
      console.error(`Error fetching grades for course ${courseId}:`, error);
      throw new Error("Failed to load course grades");
    }
  },

  async create(gradeData) {
    await delay(400);
    // Future: Replace with ApperClient.createRecord('grade_c', {records: [...]})
    try {
      const newGrade = {
        ...gradeData,
        Id: Math.max(...grades.map(g => g.Id)) + 1
      };
      grades.push(newGrade);
      return { ...newGrade };
    } catch (error) {
      console.error("Error creating grade:", error);
      throw new Error("Failed to create grade");
    }
  },

  async update(id, gradeData) {
    await delay(300);
    // Future: Replace with ApperClient.updateRecord('grade_c', {records: [...]})
    try {
      const index = grades.findIndex(g => g.Id === parseInt(id));
      if (index !== -1) {
        grades[index] = { ...grades[index], ...gradeData };
        return { ...grades[index] };
      }
      return null;
    } catch (error) {
      console.error(`Error updating grade ${id}:`, error);
      throw new Error("Failed to update grade");
    }
  },

  async delete(id) {
    await delay(200);
    // Future: Replace with ApperClient.deleteRecord('grade_c', {RecordIds: [id]})
    try {
      const index = grades.findIndex(g => g.Id === parseInt(id));
      if (index !== -1) {
        grades.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting grade ${id}:`, error);
      throw new Error("Failed to delete grade");
    }
  }
};

// Migration Notes:
// When database tables become available, replace service methods with:
// - ApperClient initialization with project ID and public key
// - ApperClient.fetchRecords for getAll() and getByCourse()
// - ApperClient.getRecordById for getById()
// - ApperClient.createRecord for create()
// - ApperClient.updateRecord for update()
// - ApperClient.deleteRecord for delete()