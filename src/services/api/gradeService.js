import gradesData from "@/services/mockData/grades.json";

const grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByCourse(courseId) {
    await delay(300);
    return grades.filter(g => g.courseId === parseInt(courseId));
  },

  async create(gradeData) {
    await delay(400);
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id)) + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades.splice(index, 1);
      return true;
    }
    return false;
  }
};