import assignmentsData from "@/services/mockData/assignments.json";

// Mock service implementation - will be replaced with ApperClient when database tables are available
const assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced service for authentication integration
export const assignmentService = {
  async getAll() {
    await delay(300);
    // Future: Replace with ApperClient.fetchRecords('assignment_c', {fields: [...]})
    try {
      return [...assignments];
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw new Error("Failed to load assignments");
    }
  },

  async getById(id) {
    await delay(200);
    // Future: Replace with ApperClient.getRecordById('assignment_c', id, {fields: [...]})
    try {
      const assignment = assignments.find(a => a.Id === parseInt(id));
      return assignment ? { ...assignment } : null;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw new Error("Failed to load assignment");
    }
  },

  async getByCourse(courseId) {
    await delay(300);
    // Future: Replace with ApperClient.fetchRecords with where clause for courseId
    try {
      return assignments.filter(a => a.courseId === parseInt(courseId));
    } catch (error) {
      console.error(`Error fetching assignments for course ${courseId}:`, error);
      throw new Error("Failed to load course assignments");
    }
  },

  async create(assignmentData) {
    await delay(400);
    // Future: Replace with ApperClient.createRecord('assignment_c', {records: [...]})
    try {
      const newAssignment = {
        ...assignmentData,
        Id: Math.max(...assignments.map(a => a.Id)) + 1
      };
      assignments.push(newAssignment);
      return { ...newAssignment };
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw new Error("Failed to create assignment");
    }
  },

  async update(id, assignmentData) {
    await delay(300);
    // Future: Replace with ApperClient.updateRecord('assignment_c', {records: [...]})
    try {
      const index = assignments.findIndex(a => a.Id === parseInt(id));
      if (index !== -1) {
        assignments[index] = { ...assignments[index], ...assignmentData };
        return { ...assignments[index] };
      }
      return null;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw new Error("Failed to update assignment");
    }
  },

  async delete(id) {
    await delay(200);
    // Future: Replace with ApperClient.deleteRecord('assignment_c', {RecordIds: [id]})
    try {
      const index = assignments.findIndex(a => a.Id === parseInt(id));
      if (index !== -1) {
        assignments.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw new Error("Failed to delete assignment");
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