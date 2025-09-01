import assignmentsData from "@/services/mockData/assignments.json";

const assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourse(courseId) {
    await delay(300);
    return assignments.filter(a => a.courseId === parseInt(courseId));
  },

  async create(assignmentData) {
    await delay(400);
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignments.map(a => a.Id)) + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments.splice(index, 1);
      return true;
    }
    return false;
  }
};