import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Game State
  period: null,
  endTime: null,
  countdown: 30,
  isLocked: false,
  history: [],
  activeTab: 'record', // 'continuous' | 'record' | 'probability' | 'myorders'

  // User Bets and Orders State
  myBets: [],
  ordersList: [],
  ordersPage: 1,
  totalOrdersPages: 1,
  totalOrdersCount: 0,
  ordersFilter: 'all', // 'all' | 'pending' | 'win' | 'lose'
  isLoadingOrders: false,
  isPlacingBet: false,

  // Modals and UI State
  betModal: null, // { type: 'green' | 'violet' | 'red' | 'number', value?: number }
  contractMoney: 10,
  quantity: 1,
  agreeRule: true,
  showRuleModal: false,
  showMoreModal: false,
  resultPopupData: null,
  selectedOrderDetail: null,
  copiedOrderId: null,
  toastMessage: null,
};

const paritySlice = createSlice({
  name: 'parity',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      const { period, endTime, countdown, isLocked } = action.payload;
      if (period !== undefined) state.period = period;
      if (endTime !== undefined) state.endTime = endTime;
      if (countdown !== undefined) state.countdown = countdown;
      if (isLocked !== undefined) state.isLocked = isLocked;
    },
    setCountdown: (state, action) => {
      const { countdown, isLocked } = action.payload;
      state.countdown = countdown;
      if (isLocked !== undefined) {
        state.isLocked = isLocked;
      }
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setMyBets: (state, action) => {
      state.myBets = action.payload;
    },
    addBet: (state, action) => {
      const newBet = action.payload;
      if (newBet) {
        state.myBets.unshift(newBet);
        state.ordersList.unshift(newBet);
        state.totalOrdersCount += 1;
      }
    },
    setOrdersData: (state, action) => {
      const { ordersList, totalOrdersPages, totalOrdersCount, ordersPage } = action.payload;
      if (ordersList !== undefined) state.ordersList = ordersList;
      if (totalOrdersPages !== undefined) state.totalOrdersPages = totalOrdersPages;
      if (totalOrdersCount !== undefined) state.totalOrdersCount = totalOrdersCount;
      if (ordersPage !== undefined) state.ordersPage = ordersPage;
    },
    setIsLoadingOrders: (state, action) => {
      state.isLoadingOrders = action.payload;
    },
    setOrdersFilter: (state, action) => {
      state.ordersFilter = action.payload;
      state.ordersPage = 1;
    },
    setOrdersPage: (state, action) => {
      state.ordersPage = action.payload;
    },
    setIsPlacingBet: (state, action) => {
      state.isPlacingBet = action.payload;
    },
    openBetModal: (state, action) => {
      state.betModal = action.payload; // { type, value }
      state.contractMoney = 10;
      state.quantity = 1;
      state.agreeRule = true;
    },
    closeBetModal: (state) => {
      state.betModal = null;
    },
    setContractMoney: (state, action) => {
      state.contractMoney = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    setAgreeRule: (state, action) => {
      state.agreeRule = action.payload;
    },
    setShowRuleModal: (state, action) => {
      state.showRuleModal = action.payload;
    },
    setShowMoreModal: (state, action) => {
      state.showMoreModal = action.payload;
    },
    setResultPopupData: (state, action) => {
      state.resultPopupData = action.payload;
    },
    setSelectedOrderDetail: (state, action) => {
      state.selectedOrderDetail = action.payload;
    },
    setCopiedOrderId: (state, action) => {
      state.copiedOrderId = action.payload;
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    resetParityState: () => initialState,
  },
});

export const {
  setCurrentGame,
  setCountdown,
  setHistory,
  setActiveTab,
  setMyBets,
  addBet,
  setOrdersData,
  setIsLoadingOrders,
  setOrdersFilter,
  setOrdersPage,
  setIsPlacingBet,
  openBetModal,
  closeBetModal,
  setContractMoney,
  setQuantity,
  setAgreeRule,
  setShowRuleModal,
  setShowMoreModal,
  setResultPopupData,
  setSelectedOrderDetail,
  setCopiedOrderId,
  setToastMessage,
  resetParityState,
} = paritySlice.actions;

export default paritySlice.reducer;
