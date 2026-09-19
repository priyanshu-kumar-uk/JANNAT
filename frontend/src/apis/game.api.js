import apiClient from './apiClient';

/**
 * Get current active game and real-time countdown info
 */
export const getCurrentGameApi = async () => {
  return await apiClient.get('/game/current');
};

/**
 * Get past completed games history for records and statistics
 * @param {number} limit
 */
export const getGameHistoryApi = async (limit = 30) => {
  return await apiClient.get(`/game/history?limit=${limit}`);
};

/**
 * Place a bet on the current active issue
 * @param {{ choice: string, contractMoney: number, quantity: number }} data
 */
export const placeBetApi = async (data) => {
  return await apiClient.post('/game/bet', data);
};

/**
 * Fetch placed bets for the authenticated user
 * Supports either (period) or ({ page, limit, status, period })
 * @param {number|object} [params]
 */
export const getMyBetsApi = async (params = {}) => {
  if (typeof params === 'number' || typeof params === 'string') {
    return await apiClient.get(`/game/my-bets?period=${params}`);
  }
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page);
  if (params?.limit) searchParams.append('limit', params.limit);
  if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
  if (params?.period) searchParams.append('period', params.period);
  const qs = searchParams.toString();
  return await apiClient.get(`/game/my-bets${qs ? `?${qs}` : ''}`);
};

/**
 * Fetch resolved bets that haven't been shown in a result popup yet
 */
export const getUnseenResultsApi = async () => {
  return await apiClient.get('/game/unseen-results');
};

/**
 * Acknowledge receipt of result popup for settled bets
 * @param {string[]} betIds
 */
export const markResultsSeenApi = async (betIds) => {
  return await apiClient.post('/game/mark-results-seen', { betIds });
};
