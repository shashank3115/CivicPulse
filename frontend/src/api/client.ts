import { DashboardData, District, DistrictDetail, Complaint, ComplaintCreate, ProcessingResult, AnalyticsData, ClusterData, CopilotResponse } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE ?? '/api').replace(/\/$/, '');

export const apiClient = {
  async getDashboard(): Promise<DashboardData | null> {
    try { const res = await fetch(`${API_BASE}/dashboard`); return await res.json(); } catch { return null; }
  },
  async getDistricts(): Promise<District[]> {
    try { const res = await fetch(`${API_BASE}/districts`); return await res.json(); } catch { return []; }
  },
  async getDistrictDetail(id: number): Promise<DistrictDetail | null> {
    try { const res = await fetch(`${API_BASE}/districts/${id}`); return await res.json(); } catch { return null; }
  },
  async getComplaints(params?: any): Promise<Complaint[]> {
    try { 
      const q = new URLSearchParams(params || {}).toString();
      const res = await fetch(`${API_BASE}/complaints${q ? '?'+q : ''}`); 
      return await res.json(); 
    } catch { return []; }
  },
  async createComplaint(data: ComplaintCreate): Promise<ProcessingResult | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch { return null; }
  },
  async getHotspots(): Promise<District[]> {
    try { const res = await fetch(`${API_BASE}/hotspots`); return await res.json(); } catch { return []; }
  },
  async getPriorities(): Promise<District[]> {
    try { const res = await fetch(`${API_BASE}/priorities`); return await res.json(); } catch { return []; }
  },
  async getAnalytics(): Promise<AnalyticsData | null> {
    try { const res = await fetch(`${API_BASE}/analytics`); return await res.json(); } catch { return null; }
  },
  async recalculate(weights: {w1: number, w2: number, w3: number}): Promise<{success: boolean}> {
    try {
      const res = await fetch(`${API_BASE}/recalculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights)
      });
      return await res.json();
    } catch { return { success: false }; }
  },
  async askCopilot(question: string): Promise<CopilotResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      return await res.json();
    } catch { return null; }
  },
  async getClusters(): Promise<ClusterData[]> {
    try { const res = await fetch(`${API_BASE}/clusters`); return await res.json(); } catch { return []; }
  },
  async runAnalysis(): Promise<{success: boolean, message: string}> {
    try {
      const res = await fetch(`${API_BASE}/analysis/run`, { method: 'POST' });
      return await res.json();
    } catch { return { success: false, message: 'Failed' }; }
  }
};
