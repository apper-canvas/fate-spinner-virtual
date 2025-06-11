import decisionsData from '../mockData/decisions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'fate_spinner_decisions';
const MAX_DECISIONS = 50;

class DecisionService {
  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.decisions = JSON.parse(stored);
      } else {
        this.decisions = [...decisionsData];
        this.saveToStorage();
      }
    } catch (error) {
      console.warn('Failed to load decisions from storage:', error);
      this.decisions = [...decisionsData];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.decisions));
    } catch (error) {
      console.warn('Failed to save decisions to storage:', error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.decisions];
  }

  async getById(id) {
    await delay(200);
    const decision = this.decisions.find(dec => dec.id === id);
    if (!decision) {
      throw new Error('Decision not found');
    }
    return { ...decision };
  }

  async create(decisionData) {
    await delay(300);
    
    if (!decisionData.options || decisionData.options.length < 2) {
      throw new Error('Decision must have at least 2 options');
    }

    if (!decisionData.winner) {
      throw new Error('Decision must have a winner');
    }

    const newDecision = {
      id: decisionData.id || `decision_${Date.now()}`,
      options: [...decisionData.options],
      winner: { ...decisionData.winner },
      method: decisionData.method || 'wheel',
      timestamp: decisionData.timestamp || new Date().toISOString()
    };

    // Add to beginning of array
    this.decisions.unshift(newDecision);

    // Keep only latest MAX_DECISIONS
    if (this.decisions.length > MAX_DECISIONS) {
      this.decisions = this.decisions.slice(0, MAX_DECISIONS);
    }

    this.saveToStorage();
    return { ...newDecision };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.decisions.findIndex(dec => dec.id === id);
    if (index === -1) {
      throw new Error('Decision not found');
    }

    this.decisions[index] = {
      ...this.decisions[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return { ...this.decisions[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.decisions.findIndex(dec => dec.id === id);
    if (index === -1) {
      throw new Error('Decision not found');
    }

    const deleted = this.decisions.splice(index, 1)[0];
    this.saveToStorage();
    return { ...deleted };
  }

  async clearAll() {
    await delay(300);
    this.decisions = [];
    this.saveToStorage();
    return [];
  }

  async getRecentDecisions(limit = 10) {
    await delay(200);
    return this.decisions.slice(0, limit).map(dec => ({ ...dec }));
  }

  async getDecisionsByMethod(method) {
    await delay(200);
    return this.decisions
      .filter(dec => dec.method === method)
      .map(dec => ({ ...dec }));
  }

  async getDecisionStats() {
    await delay(250);
    const stats = {
      total: this.decisions.length,
      byMethod: {},
      recentActivity: this.decisions.slice(0, 5).map(dec => ({
        id: dec.id,
        winner: dec.winner.text,
        method: dec.method,
        timestamp: dec.timestamp
      }))
    };

    // Count by method
    this.decisions.forEach(dec => {
      stats.byMethod[dec.method] = (stats.byMethod[dec.method] || 0) + 1;
    });

    return stats;
  }
}

export default new DecisionService();