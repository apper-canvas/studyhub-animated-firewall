import studySessionsData from '@/services/mockData/studySessions.json';

// Enhanced StudySessionService for authentication integration
class StudySessionService {
  constructor() {
    this.sessions = [...studySessionsData];
    this.nextId = Math.max(...this.sessions.map(s => s.Id), 0) + 1;
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    // Future: Replace with ApperClient.fetchRecords('study_session_c', {fields: [...]})
    try {
      return [...this.sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      throw new Error("Failed to load study sessions");
    }
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Future: Replace with ApperClient.getRecordById('study_session_c', id, {fields: [...]})
    try {
      const session = this.sessions.find(s => s.Id === parseInt(id));
      if (!session) {
        throw new Error(`Study session with ID ${id} not found`);
      }
      return { ...session };
    } catch (error) {
      console.error(`Error fetching study session ${id}:`, error);
      throw error;
    }
  }

  async create(sessionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Future: Replace with ApperClient.createRecord('study_session_c', {records: [...]})
    try {
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
    } catch (error) {
      console.error("Error creating study session:", error);
      throw new Error("Failed to create study session");
    }
  }

  async update(id, sessionData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Future: Replace with ApperClient.updateRecord('study_session_c', {records: [...]})
    try {
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
    } catch (error) {
      console.error(`Error updating study session ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Future: Replace with ApperClient.deleteRecord('study_session_c', {RecordIds: [id]})
    try {
      const index = this.sessions.findIndex(s => s.Id === parseInt(id));
      if (index === -1) {
        throw new Error(`Study session with ID ${id} not found`);
      }

      this.sessions.splice(index, 1);
      return true;
    } catch (error) {
      console.error(`Error deleting study session ${id}:`, error);
      throw error;
    }
  }

  // Get sessions for specific date range
  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 150));
    // Future: Replace with ApperClient.fetchRecords with date range where clause
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return this.sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= start && sessionDate <= end;
      }).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } catch (error) {
      console.error("Error fetching study sessions by date range:", error);
      throw new Error("Failed to load study sessions for date range");
    }
  }

  // Get today's sessions
  async getTodaySessions() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      return this.getByDateRange(startOfDay, endOfDay);
    } catch (error) {
      console.error("Error fetching today's study sessions:", error);
      throw new Error("Failed to load today's study sessions");
    }
  }
}

export const studySessionService = new StudySessionService();

// Migration Notes:
// When database tables become available, replace service methods with:
// - ApperClient initialization with project ID and public key
// - ApperClient.fetchRecords for getAll() and getByDateRange()
// - ApperClient.getRecordById for getById()
// - ApperClient.createRecord for create()
// - ApperClient.updateRecord for update()
// - ApperClient.deleteRecord for delete()
// - Date range queries using where clauses for getByDateRange() and getTodaySessions()