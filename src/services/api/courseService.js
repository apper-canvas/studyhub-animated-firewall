import coursesData from "@/services/mockData/courses.json";

const courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      Id: Math.max(...courses.map(c => c.Id)) + 1,
      currentGrade: 0,
      assignmentCount: 0
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(300);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData };
      return { ...courses[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses.splice(index, 1);
      return true;
    }
    return false;
  }
};