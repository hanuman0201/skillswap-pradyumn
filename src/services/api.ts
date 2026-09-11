/**
 * SkillSpace Dedicated Backend API Client
 * Interacts directly with the Express API server on /api/*
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const api = {
  // Check backend health and status
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend /api/health unavailable:', err.message);
      return null;
    }
  },

  // Get current user profile from server
  async getUser() {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch user');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend /api/user error:', err.message);
      return null;
    }
  },

  // Update user profile on server
  async updateUser(updates: any) {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend updateUser error:', err.message);
      return null;
    }
  },

  // Fetch all barter contacts & messages
  async getContacts() {
    try {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend getContacts error:', err.message);
      return null;
    }
  },

  // Send a message or session proposal to contact
  async sendMessage(contactId: string, payload: { text?: string; isSessionProposal?: boolean; sessionProposal?: any }) {
    try {
      const res = await fetch(`/api/contacts/${contactId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend sendMessage error:', err.message);
      return null;
    }
  },

  // Propose a session swap
  async proposeSession(contactId: string, sessionData: { topic: string; date: string; time: string; tradeType: 'coins' | 'barter' }) {
    try {
      const res = await fetch('/api/sessions/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId, ...sessionData }),
      });
      if (!res.ok) throw new Error('Failed to propose session');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend proposeSession error:', err.message);
      return null;
    }
  },

  // Accept or decline proposal (handles 40 coins logic server-side)
  async handleProposalAction(proposalId: string, action: 'accepted' | 'declined', contactId?: string) {
    try {
      const res = await fetch(`/api/sessions/${proposalId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, contactId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update proposal');
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Backend handleProposalAction error:', err.message);
      throw err;
    }
  },

  // Get wallet ledger logs
  async getWalletLedger() {
    try {
      const res = await fetch('/api/wallet/ledger');
      if (!res.ok) throw new Error('Failed to fetch ledger');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend getWalletLedger error:', err.message);
      return null;
    }
  },

  // Top-up or teaching reward (faucet)
  async topUpCoins(amount = 40, reason = 'Taught Peer Session') {
    try {
      const res = await fetch('/api/wallet/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason }),
      });
      if (!res.ok) throw new Error('Failed to add coins');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend topUpCoins error:', err.message);
      return null;
    }
  },

  // Explore skills catalog
  async getSkills(query?: { category?: string; search?: string; tradeMode?: string }) {
    try {
      const params = new URLSearchParams();
      if (query?.category) params.append('category', query.category);
      if (query?.search) params.append('search', query.search);
      if (query?.tradeMode) params.append('tradeMode', query.tradeMode);

      const res = await fetch(`/api/skills/explore?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch skills catalog');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend getSkills error:', err.message);
      return null;
    }
  },

  // Matchmaking
  async matchmake(skillsToTeach: any[], skillsToLearn: any[]) {
    try {
      const res = await fetch('/api/matchmake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillsToTeach, skillsToLearn }),
      });
      if (!res.ok) throw new Error('Failed to matchmake');
      return await res.json();
    } catch (err: any) {
      console.warn('Backend matchmake error:', err.message);
      return null;
    }
  },
};
