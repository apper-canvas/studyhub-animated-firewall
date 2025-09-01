import studySessionsData from '@/services/mockData/studySessions.json';

class StudySessionService {
  constructor() {
    this.sessions = [...studySessionsData];
    this.nextId = Math.max(...this.sessions.map(s => s.Id), 0) + 1;
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const session = this.sessions.find(s => s.Id === parseInt(id));
    if (!session) {
      throw new Error(`Study session with ID ${id} not found`);
    }
    return { ...session };
  }

  async create(sessionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newSession = {
      Id: this.nextId++,
      type: sessionData.type || 'study', // 'study' or 'break'
      plannedDuration: sessionData.plannedDuration || 25, // in minutes
      actualDuration: sessionData.actualDuration || null, // in minutes, null if incomplete
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: sessionData.endTime || null,
      completed: sessionData.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, sessionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Study session with ID ${id} not found`);
    }

    const updatedSession = {
      ...this.sessions[index],
      ...sessionData,
      updatedAt: new Date().toISOString()
    };

    this.sessions[index] = updatedSession;
    return { ...updatedSession };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Study session with ID ${id} not found`);
    }

    this.sessions.splice(index, 1);
    return true;
  }

  // Get sessions for specific date range
  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= start && sessionDate <= end;
    }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  }

  // Get today's sessions
  async getTodaySessions() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    return this.getByDateRange(startOfDay, endOfDay);
  }
}

export const studySessionService = new StudySessionService();