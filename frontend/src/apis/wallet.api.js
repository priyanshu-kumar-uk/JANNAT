import apiClient from './apiClient';

/**
 * Fetch wallet balance, check-in streak, VIP tier, bank accounts, and statistics
 */
export const getWalletSummaryApi = async () => {
  return await apiClient.get('/wallet/summary');
};

/**
 * Fetch paginated transaction records (recharges, withdrawals, check-ins)
 * @param {{ page?: number, limit?: number, type?: string }} [params]
 */
export const getTransactionsApi = async (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page);
  if (params?.limit) searchParams.append('limit', params.limit);
  if (params?.type && params.type !== 'ALL') searchParams.append('type', params.type);
  const qs = searchParams.toString();
  return await apiClient.get(`/wallet/transactions${qs ? `?${qs}` : ''}`);
};

/**
 * Recharge wallet with specified amount and channel
 * @param {{ amount: number, channel?: string }} data
 */
export const rechargeWalletApi = async (data) => {
  return await apiClient.post('/wallet/recharge', data);
};

/**
 * Request payout / withdrawal
 * @param {{ amount: number, bankAccountId?: string }} data
 */
export const withdrawWalletApi = async (data) => {
  return await apiClient.post('/wallet/withdraw', data);
};

/**
 * Claim daily 7-day streak check-in bonus
 */
export const claimCheckInApi = async () => {
  return await apiClient.post('/wallet/checkin');
};

/**
 * Add a new Bank Account or UPI ID to user profile
 * @param {{ bankName: string, accountNumber: string, holderName: string, ifsc?: string, type?: string }} data
 */
export const addBankAccountApi = async (data) => {
  return await apiClient.post('/wallet/bank-accounts', data);
};

/**
 * Delete a linked Bank Account or UPI ID
 * @param {string} id
 */
export const deleteBankAccountApi = async (id) => {
  return await apiClient.delete(`/wallet/bank-accounts/${id}`);
};
