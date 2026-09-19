import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentGameApi,
  getGameHistoryApi,
  placeBetApi,
  getMyBetsApi,
  getUnseenResultsApi,
  markResultsSeenApi,
} from '../apis/game.api';
import { getMeUser, updateWalletBalance } from '../store/slices/authSlice';
import {
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
} from '../store/slices/parity.slice';

const useParity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth state
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Parity state
  const {
    period,
    endTime,
    countdown,
    isLocked,
    history,
    activeTab,
    myBets,
    ordersList,
    ordersPage,
    totalOrdersPages,
    totalOrdersCount,
    ordersFilter,
    isLoadingOrders,
    isPlacingBet,
    betModal,
    contractMoney,
    quantity,
    agreeRule,
    showRuleModal,
    showMoreModal,
    resultPopupData,
    selectedOrderDetail,
    copiedOrderId,
    toastMessage,
  } = useSelector((state) => state.parity);

  /**
   * Show toast notification
   */
  const handleShowToast = useCallback((msg) => {
    dispatch(setToastMessage(msg));
    setTimeout(() => {
      dispatch(setToastMessage(null));
    }, 2500);
  }, [dispatch]);

  /**
   * Fetch current game period and countdown
   */
  const handleFetchCurrentGame = useCallback(async () => {
    try {
      const res = await getCurrentGameApi();
      if (res.success && res.game) {
        const rem = Math.max(0, Math.ceil((new Date(res.game.endTime).getTime() - Date.now()) / 1000));
        dispatch(
          setCurrentGame({
            period: res.game.period,
            endTime: res.game.endTime,
            countdown: rem,
            isLocked: rem <= 5,
          })
        );
      }
    } catch (err) {
      console.error('Failed to fetch current game:', err.message);
    }
  }, [dispatch]);

  /**
   * Fetch historical games
   */
  const handleFetchHistory = useCallback(async (limit = 40) => {
    try {
      const res = await getGameHistoryApi(limit);
      if (res.success && Array.isArray(res.history)) {
        // Backend returns newest first. Reverse for chronological left-to-right matrix display
        dispatch(setHistory(res.history.slice().reverse()));
      }
    } catch (err) {
      console.error('Failed to fetch game history:', err.message);
    }
  }, [dispatch]);

  /**
   * Fetch current user bets
   */
  const handleFetchMyBets = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getMyBetsApi();
      if (res.success && Array.isArray(res.bets)) {
        dispatch(setMyBets(res.bets));
      }
    } catch (err) {
      console.error('Failed to fetch my bets:', err.message);
    }
  }, [isAuthenticated, dispatch]);

  /**
   * Fetch paginated orders for the "My Orders" tab
   */
  const handleFetchOrdersList = useCallback(async (page = 1, status = 'all') => {
    if (!isAuthenticated) return;
    dispatch(setIsLoadingOrders(true));
    try {
      const res = await getMyBetsApi({
        page,
        limit: 10,
        status: status === 'all' ? undefined : status,
      });
      if (res.success && Array.isArray(res.bets)) {
        dispatch(
          setOrdersData({
            ordersList: res.bets,
            totalOrdersPages: res.totalPages || 1,
            totalOrdersCount: res.totalBets || res.bets.length,
            ordersPage: res.currentPage || page,
          })
        );
      }
    } catch (err) {
      console.error('Failed to fetch orders list:', err.message);
    } finally {
      dispatch(setIsLoadingOrders(false));
    }
  }, [isAuthenticated, dispatch]);

  /**
   * Check for newly settled bets to trigger result popup
   */
  const handleCheckUnseenResults = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnseenResultsApi();
      if (res.success && Array.isArray(res.results) && res.results.length > 0) {
        const latestRoundBets = res.results;
        const targetPeriod = latestRoundBets[0].period;
        const roundBets = latestRoundBets.filter((b) => b.period === targetPeriod);

        let totalPoint = 0;
        let totalWinAmt = 0;
        const selectedLabels = [];
        let resultNumber = null;
        let price = '$43,850';

        roundBets.forEach((b) => {
          totalPoint += b.amount;
          totalWinAmt += b.winAmount || 0;
          selectedLabels.push(b.betType === 'number' ? `Num ${b.choice}` : b.choice.toUpperCase());

          if (b.gameId && typeof b.gameId === 'object') {
            if (b.gameId.resultNumber !== undefined) resultNumber = b.gameId.resultNumber;
            if (b.gameId.price) price = `$${b.gameId.price}`;
          }
        });

        if (resultNumber === null && history.length > 0) {
          const matchHistory = history.find((h) => h.period === targetPeriod);
          if (matchHistory) resultNumber = matchHistory.resultNumber;
        }

        const isWin = totalWinAmt > 0;
        const betIds = roundBets.map((b) => b._id);

        dispatch(
          setResultPopupData({
            isOpen: true,
            isWin,
            resultNumber: resultNumber ?? 0,
            period: targetPeriod,
            price,
            select: selectedLabels.join(', '),
            point: totalPoint,
            amount: isWin ? totalWinAmt : -totalPoint,
            betIds,
          })
        );

        dispatch(getMeUser());
      }
    } catch (err) {
      console.error('Error checking unseen results:', err.message);
    }
  }, [isAuthenticated, history, dispatch]);

  /**
   * Place a bet on the current round
   */
  const handleBet = useCallback(async () => {
    if (!agreeRule) {
      handleShowToast('Please agree to PRESALE RULE');
      return;
    }

    const totalAmount = contractMoney * quantity;
    const currentBalance = user?.walletBalance || 0;

    if (currentBalance < totalAmount) {
      handleShowToast(`Insufficient balance! You have ₹${currentBalance}, need ₹${totalAmount}.`);
      return;
    }

    if (isLocked) {
      handleShowToast('Betting locked for this round!');
      return;
    }

    dispatch(setIsPlacingBet(true));
    try {
      const choice = betModal.type === 'number' ? String(betModal.value) : betModal.type;
      const res = await placeBetApi({
        choice,
        contractMoney,
        quantity,
      });

      if (res.success) {
        handleShowToast(`Order Placed for ₹${totalAmount}!`);
        dispatch(updateWalletBalance(-totalAmount));
        if (res.bet) {
          dispatch(addBet(res.bet));
        }
        dispatch(closeBetModal());
      } else {
        handleShowToast(res.message || 'Failed to place bet');
      }
    } catch (err) {
      handleShowToast(err.message || 'Failed to place bet');
    } finally {
      dispatch(setIsPlacingBet(false));
    }
  }, [
    agreeRule,
    contractMoney,
    quantity,
    user?.walletBalance,
    isLocked,
    betModal,
    dispatch,
    handleShowToast,
  ]);

  /**
   * Close Result Popup and acknowledge seen results
   */
  const handleCloseResultPopup = useCallback(async () => {
    if (resultPopupData?.betIds && resultPopupData.betIds.length > 0) {
      try {
        await markResultsSeenApi(resultPopupData.betIds);
      } catch (err) {
        console.error('Failed to mark results seen:', err.message);
      }
    }
    dispatch(setResultPopupData(null));
  }, [resultPopupData, dispatch]);

  /**
   * Copy Order ID to clipboard
   */
  const handleCopyOrderId = useCallback((id) => {
    if (!id) return;
    navigator.clipboard.writeText(String(id));
    dispatch(setCopiedOrderId(id));
    handleShowToast('Order ID copied to clipboard');
    setTimeout(() => {
      dispatch(setCopiedOrderId(null));
    }, 2000);
  }, [dispatch, handleShowToast]);

  /**
   * Open bet bottom-sheet modal with validation
   */
  const handleOpenBetModal = useCallback((type, value = null) => {
    if (!isAuthenticated) {
      handleShowToast('Please login to place bets!');
      navigate('/login');
      return;
    }

    if (isLocked) {
      handleShowToast('Betting locked for this round! Please wait for next issue.');
      return;
    }

    dispatch(openBetModal({ type, value }));
  }, [isAuthenticated, isLocked, navigate, handleShowToast, dispatch]);

  /**
   * Close bet modal
   */
  const handleCloseBetModal = useCallback(() => {
    dispatch(closeBetModal());
  }, [dispatch]);

  /**
   * Set contract money denomination
   */
  const handleSetContractMoney = useCallback((amt) => {
    dispatch(setContractMoney(amt));
  }, [dispatch]);

  /**
   * Set contract multiplier quantity
   */
  const handleSetQuantity = useCallback((qty) => {
    const val = typeof qty === 'function' ? qty(quantity) : qty;
    dispatch(setQuantity(Math.max(1, val)));
  }, [dispatch, quantity]);

  /**
   * Toggle agree presale rule checkbox
   */
  const handleSetAgreeRule = useCallback((agree) => {
    dispatch(setAgreeRule(agree));
  }, [dispatch]);

  /**
   * Switch active tab
   */
  const handleTabChange = useCallback((tab) => {
    dispatch(setActiveTab(tab));
  }, [dispatch]);

  /**
   * Change orders filter pill
   */
  const handleFilterChange = useCallback((filter) => {
    dispatch(setOrdersFilter(filter));
    handleFetchOrdersList(1, filter);
  }, [dispatch, handleFetchOrdersList]);

  /**
   * Paginate orders list
   */
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > totalOrdersPages) return;
    dispatch(setOrdersPage(newPage));
    handleFetchOrdersList(newPage, ordersFilter);
  }, [dispatch, handleFetchOrdersList, ordersFilter, totalOrdersPages]);

  /**
   * Toggle rules modal
   */
  const handleSetShowRuleModal = useCallback((show) => {
    dispatch(setShowRuleModal(show));
  }, [dispatch]);

  /**
   * Toggle more history modal
   */
  const handleSetShowMoreModal = useCallback((show) => {
    dispatch(setShowMoreModal(show));
  }, [dispatch]);

  /**
   * Select order detail for modal
   */
  const handleSelectOrderDetail = useCallback((order) => {
    dispatch(setSelectedOrderDetail(order));
  }, [dispatch]);

  /**
   * Countdown tick updater
   */
  const handleCountdownTick = useCallback((remSec) => {
    dispatch(setCountdown({ countdown: remSec, isLocked: remSec <= 5 }));
  }, [dispatch]);

  return {
    // Redux State
    user,
    isAuthenticated,
    period,
    endTime,
    countdown,
    isLocked,
    history,
    activeTab,
    myBets,
    ordersList,
    ordersPage,
    totalOrdersPages,
    totalOrdersCount,
    ordersFilter,
    isLoadingOrders,
    isPlacingBet,
    betModal,
    contractMoney,
    quantity,
    agreeRule,
    showRuleModal,
    showMoreModal,
    resultPopupData,
    selectedOrderDetail,
    copiedOrderId,
    toastMessage,

    // Action & API Handlers (All prefixed with handle...)
    handleBet,
    handleConfirmBet: handleBet,
    handleFetchCurrentGame,
    handleFetchHistory,
    handleFetchMyBets,
    handleFetchOrdersList,
    handleCheckUnseenResults,
    handleCloseResultPopup,
    handleCopyOrderId,
    handleOpenBetModal,
    handleCloseBetModal,
    handleSetContractMoney,
    handleSetQuantity,
    handleSetAgreeRule,
    handleTabChange,
    handleFilterChange,
    handlePageChange,
    handleSetShowRuleModal,
    handleSetShowMoreModal,
    handleSelectOrderDetail,
    handleCountdownTick,
    handleShowToast,
  };
};

export default useParity;