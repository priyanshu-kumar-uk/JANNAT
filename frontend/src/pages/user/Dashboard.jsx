import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ShieldCheck,
  Zap,
  Gift,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  LogOut,
  ChevronRight,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  PhoneCall,
  Settings,
  CreditCard,
  RefreshCw,
  Star,
  Share2,
  X,
  Lock,
  Volume2,
  VolumeX,
  Building2,
  QrCode,
  CheckCircle2,
  Loader2,
  Trash2,
} from 'lucide-react';
import { logoutUser, getMeUser, setWalletBalance } from '../../store/slices/authSlice';
import { getMyBetsApi } from '../../apis/game.api';
import {
  getWalletSummaryApi,
  getTransactionsApi,
  rechargeWalletApi,
  withdrawWalletApi,
  claimCheckInApi,
  addBankAccountApi,
  deleteBankAccountApi,
} from '../../apis/wallet.api';

/**
 * Format relative or localized timestamps cleanly
 */
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // General UI States
  const [showBalance, setShowBalance] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'transactions' | 'passbook' | 'security'
  const [toastMessage, setToastMessage] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameFilter, setGameFilter] = useState('ALL');

  // Backend Live Data States
  const [walletSummary, setWalletSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const [bets, setBets] = useState([]);
  const [isBetsLoading, setIsBetsLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [isTxnsLoading, setIsTxnsLoading] = useState(false);

  const [bankAccounts, setBankAccounts] = useState([]);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isClaimingCheckIn, setIsClaimingCheckIn] = useState(false);

  // Modals
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Bank Form State
  const [newBank, setNewBank] = useState({
    type: 'BANK',
    bankName: '',
    accountNumber: '',
    holderName: '',
    ifsc: '',
  });

  // Recharge Form State
  const [rechargeAmount, setRechargeAmount] = useState(500);
  const [rechargeChannel, setRechargeChannel] = useState('UPI-Fast');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState(''); // ID of selected bank account

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName}!`);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // =========================================================================
  // DATA FETCHING & SYNCHRONIZATION WITH BACKEND
  // =========================================================================

  const fetchBets = async () => {
    if (!isAuthenticated) return;
    setIsBetsLoading(true);
    try {
      const res = await getMyBetsApi({ limit: 40 });
      if (res?.success && Array.isArray(res?.bets)) {
        const formatted = res.bets.map((b) => {
          const isWin = b.result === 'WIN';
          const isLose = b.result === 'LOSE';
          const selectLabel =
            b.betType === 'number'
              ? `Number ${b.choice} (9x)`
              : `${b.choice.toUpperCase()} (${
                  b.choice.toLowerCase() === 'violet' ? '4.5x' : '2x'
                })`;

          return {
            id: b._id,
            game: 'Fast-Parity',
            short: 'FP',
            period: b.period,
            select: selectLabel,
            amount: b.amount,
            payout: b.winAmount || 0,
            status: isWin ? 'WON' : isLose ? 'LOST' : 'WAITING',
            time: formatRelativeTime(b.createdAt),
            color: isWin ? 'emerald' : isLose ? 'rose' : 'amber',
          };
        });
        setBets(formatted);
      }
    } catch (err) {
      console.error('Failed to load bets:', err);
    } finally {
      setIsBetsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!isAuthenticated) return;
    setIsTxnsLoading(true);
    try {
      const res = await getTransactionsApi({ limit: 30 });
      if (res?.success && Array.isArray(res?.transactions)) {
        setTransactions(res.transactions);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsTxnsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    setIsSummaryLoading(true);
    try {
      // 1. Refresh user profile in Redux from backend /api/auth/me
      dispatch(getMeUser());

      // 2. Fetch live wallet summary & statistics from /api/wallet/summary
      const summaryRes = await getWalletSummaryApi();
      if (summaryRes?.success && summaryRes?.summary) {
        setWalletSummary(summaryRes.summary);
        const accounts = summaryRes.summary.bankAccounts || [];
        setBankAccounts(accounts);
        if (accounts.length > 0 && !withdrawMethod) {
          setWithdrawMethod(accounts[0]._id);
        }
      }

      // 3. Fetch Bet Records
      fetchBets();

      // 4. Fetch Transactions
      fetchTransactions();
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================

  const handleClaimCheckIn = async (day) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (walletSummary?.claimedToday) {
      showToast("Already claimed today's bonus.");
      return;
    }

    setIsClaimingCheckIn(true);
    try {
      const res = await claimCheckInApi();
      if (res?.success) {
        dispatch(setWalletBalance(res.newBalance));
        setWalletSummary((prev) => ({
          ...prev,
          walletBalance: res.newBalance,
          checkInStreak: res.newStreak,
          claimedToday: true,
        }));
        showToast(res.message || `Claimed Day ${res.newStreak} Bonus: +₹${res.bonusAmount}!`);
        fetchTransactions();
      }
    } catch (err) {
      showToast(err.message || 'Failed to claim daily bonus');
    } finally {
      setIsClaimingCheckIn(false);
    }
  };

  const handleAddBankAccount = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newBank.bankName || !newBank.accountNumber || !newBank.holderName) {
      showToast('Please fill all required fields');
      return;
    }

    setIsSavingBank(true);
    try {
      const res = await addBankAccountApi({
        type: newBank.type,
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        holderName: newBank.holderName,
        ifsc: newBank.ifsc,
      });

      if (res?.success && res.bankAccounts) {
        setBankAccounts(res.bankAccounts);
        if (!withdrawMethod && res.bankAccounts.length > 0) {
          setWithdrawMethod(res.bankAccounts[0]._id);
        }
        setShowAddBankModal(false);
        setNewBank({ type: 'BANK', bankName: '', accountNumber: '', holderName: '', ifsc: '' });
        showToast('Payment account saved successfully!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save payout account');
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleDeleteBankAccount = async (id) => {
    try {
      const res = await deleteBankAccountApi(id);
      if (res?.success && res.bankAccounts) {
        setBankAccounts(res.bankAccounts);
        if (withdrawMethod === id) {
          setWithdrawMethod(res.bankAccounts[0]?._id || '');
        }
        showToast('Account removed');
      }
    } catch (err) {
      showToast(err.message || 'Failed to remove account');
    }
  };

  const handleRechargeSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const num = Number(rechargeAmount);
    if (isNaN(num) || num < 20) {
      showToast('Minimum recharge is ₹20');
      return;
    }

    setIsRecharging(true);
    try {
      const res = await rechargeWalletApi({
        amount: num,
        channel: rechargeChannel,
      });

      if (res?.success) {
        dispatch(setWalletBalance(res.newBalance));
        setWalletSummary((prev) => ({
          ...prev,
          walletBalance: res.newBalance,
          totalRecharged: (prev?.totalRecharged || 0) + num,
        }));
        setShowRechargeModal(false);
        showToast(`Recharge of ₹${num} completed!`);
        fetchTransactions();
      }
    } catch (err) {
      showToast(err.message || 'Recharge failed');
    } finally {
      setIsRecharging(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const num = Number(withdrawAmount);
    if (isNaN(num) || num < 200) {
      showToast('Minimum withdrawal is ₹200');
      return;
    }
    const currentBalance = user?.walletBalance || 0;
    if (num > currentBalance) {
      showToast(`Insufficient balance! Available: ₹${currentBalance.toFixed(2)}`);
      return;
    }

    if (!bankAccounts || bankAccounts.length === 0) {
      showToast('Please add a payout account first');
      setShowWithdrawModal(false);
      setShowAddBankModal(true);
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await withdrawWalletApi({
        amount: num,
        bankAccountId: withdrawMethod || bankAccounts[0]?._id,
      });

      if (res?.success) {
        dispatch(setWalletBalance(res.newBalance));
        setWalletSummary((prev) => ({
          ...prev,
          walletBalance: res.newBalance,
          totalWithdrawn: (prev?.totalWithdrawn || 0) + num,
        }));
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        showToast(`Withdrawal of ₹${num} processed!`);
        fetchTransactions();
      }
    } catch (err) {
      showToast(err.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser());
      setShowLogoutModal(false);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Derived user metadata
  const displayName = isAuthenticated ? (user?.fullName || 'Jannat Player') : 'Guest Player';
  const displayMobile = isAuthenticated ? (user?.mobileNumber || 'Guest') : 'Guest';
  const displayId = isAuthenticated ? (user?._id?.slice(-8).toUpperCase() || 'JNT88492') : 'GUEST-001';
  const displayBalance = isAuthenticated
    ? (Number(user?.walletBalance) || 0).toFixed(2)
    : '0.00';
  const referralCode = isAuthenticated
    ? (walletSummary?.referralCode || user?.mobileNumber || user?._id?.slice(-6).toUpperCase() || 'JANNAT777')
    : 'JNT-DEMO';
  const vipLevel = walletSummary?.vipLevel || 1;

  // Streak calculation
  const currentStreak = walletSummary?.checkInStreak || 0;
  const isClaimedToday = walletSummary?.claimedToday || false;
  const nextClaimDay = isClaimedToday ? currentStreak : Math.min(currentStreak + 1, 7);

  // Filtered bets
  const filteredBets =
    gameFilter === 'ALL'
      ? bets
      : bets.filter((b) => b.game.toLowerCase().includes(gameFilter.toLowerCase()));

  return (
    <div className="w-full min-h-full bg-[#FAF8F5] flex flex-col font-sans select-none pb-24 text-gray-800 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#14100E] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-2 animate-fade-in">
          <Sparkles size={13} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN TOP HEADER                                                       */}
      {/* ========================================================================= */}
      <div className="w-full px-4 py-3 bg-[#1A110B] text-white flex items-center justify-between sticky top-0 z-30 border-b border-[#2C1C14]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FAF6F0] p-0.5 flex items-center justify-center">
            <img src="/logo/Jannat-Logo.png" alt="Jannat" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif font-bold text-sm tracking-wide text-amber-100">
            My Account
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showToast(soundEnabled ? 'Audio Muted' : 'Audio Enabled');
            }}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
            title="Toggle Audio"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => showToast('Telegram: @JannatSupportBot')}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
            title="24/7 Support"
          >
            <PhoneCall size={13} />
          </button>
        </div>
      </div>

      {/* Guest Mode Notice */}
      {!isAuthenticated && (
        <div className="w-full bg-amber-50 border-b border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs text-[#78350F]">
          <div className="flex items-center gap-1.5 font-medium text-[11px]">
            <Lock size={12} className="text-amber-700" />
            <span>Login to access your wallet, withdrawals & records</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-2.5 py-0.5 bg-[#8B3A13] text-white font-bold text-[10px] rounded-md shadow-xs active:scale-95 cursor-pointer"
          >
            Login
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SOLID LUXURY PROFILE & WALLET CARD                                     */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full rounded-2xl bg-[#1C120C] p-4 text-white border border-[#2D1E16] shadow-sm">
          
          {/* User Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-[#2C1910] border border-amber-500/30 flex items-center justify-center text-amber-200 font-serif font-black text-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>

              {/* Name & ID */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white font-serif">{displayName}</h2>
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-400/30 uppercase">
                    VIP {vipLevel}
                  </span>
                </div>
                
                <button
                  onClick={() => copyToClipboard(displayId, 'User ID')}
                  className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <span className="font-mono">ID: {displayId}</span>
                  {copiedField === 'User ID' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                </button>
              </div>
            </div>

            {/* Quick Share */}
            <button
              onClick={() => copyToClipboard(`https://jannat.game/join?ref=${referralCode}`, 'Referral Link')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-amber-200 transition-colors cursor-pointer"
            >
              <Share2 size={12} />
              <span>Share</span>
            </button>
          </div>

          {/* Balance Row */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-medium">
                <span>Wallet Balance</span>
                <button onClick={() => setShowBalance(!showBalance)} className="cursor-pointer text-zinc-400 hover:text-zinc-200">
                  {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  onClick={fetchDashboardData}
                  disabled={isSummaryLoading}
                  className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Sync Balance"
                >
                  <RefreshCw size={11} className={isSummaryLoading ? 'animate-spin text-amber-400' : ''} />
                </button>
              </div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {showBalance ? `₹${displayBalance}` : '₹ ••••••••'}
              </div>
            </div>

            {/* Recharge & Withdraw Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRechargeModal(true)}
                className="px-3.5 py-1.5 bg-[#2196f3] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowDownLeft size={13} />
                <span>Recharge</span>
              </button>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-3.5 py-1.5 bg-[#8B3A13] hover:bg-[#742E0E] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowUpRight size={13} />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 7-DAY STREAK DAILY CHECK-IN STRIP                                       */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CalendarCheck size={14} className="text-[#8B3A13]" />
              <span className="text-xs font-bold text-gray-900">
                7-Day Streak {currentStreak > 0 ? `(Day ${currentStreak})` : ''}
              </span>
            </div>
            <button
              onClick={() => handleClaimCheckIn(nextClaimDay)}
              disabled={isClaimedToday || isClaimingCheckIn}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                isClaimedToday
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#8B3A13] text-white hover:bg-[#742E0E] active:scale-95 shadow-xs'
              }`}
            >
              {isClaimingCheckIn ? 'Claiming...' : isClaimedToday ? 'Claimed ✓' : 'Claim Daily'}
            </button>
          </div>

          {/* 7-Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day < nextClaimDay || (day === nextClaimDay && isClaimedToday);
              const isCurrent = day === nextClaimDay && !isClaimedToday;
              return (
                <div
                  key={day}
                  className={`py-1 rounded-lg text-center border transition-all ${
                    isPast
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : isCurrent
                      ? 'bg-amber-50 border-amber-400 text-[#8B3A13] font-bold shadow-2xs'
                      : 'bg-gray-50/50 border-gray-200/60 text-gray-400'
                  }`}
                >
                  <span className="text-[9px] block">D{day}</span>
                  <span className="text-[10px] font-black leading-none mt-0.5 block">
                    +{day * 10}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TABS: Bet Logs | Transactions | Passbook (Bank) | Security              */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        {/* Tab Buttons */}
        <div className="grid grid-cols-4 bg-gray-200/80 p-1 rounded-xl gap-1">
          {[
            { id: 'records', label: 'Bet Logs', icon: History },
            { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
            { id: 'passbook', label: 'Passbook', icon: Building2 },
            { id: 'security', label: 'Security', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'records' && bets.length === 0) fetchBets();
                  if (tab.id === 'transactions' && transactions.length === 0) fetchTransactions();
                }}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#8B3A13]' : 'text-gray-400'} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: BET RECORDS (LIVE DATA)                                        */}
        {/* ===================================================================== */}
        {activeTab === 'records' && (
          <div className="mt-3 space-y-2">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {['ALL', 'Fast-Parity', 'Crash', 'MineSweeper', 'Andar Bahar'].map((game) => (
                <button
                  key={game}
                  onClick={() => setGameFilter(game)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    gameFilter === game
                      ? 'bg-[#8B3A13] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>

            {/* List */}
            {isBetsLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Loader2 size={20} className="animate-spin text-[#8B3A13]" />
                <span className="text-xs">Loading bet logs...</span>
              </div>
            ) : filteredBets.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#8B3A13] mb-2.5">
                  <History size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">No Bet Records Found</h4>
                <p className="text-[11px] text-gray-500 max-w-xs mt-0.5">
                  {gameFilter === 'ALL' || gameFilter === 'Fast-Parity'
                    ? "You haven't placed any bets yet. Play Fast-Parity and win up to 9x!"
                    : `No bet activity recorded for ${gameFilter}.`}
                </p>
                <button
                  onClick={() => navigate('/parity')}
                  className="mt-3 px-4 py-1.5 bg-[#8B3A13] hover:bg-[#742E0E] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Play Fast-Parity</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ) : (
              filteredBets.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3 border border-gray-200/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-[11px] text-gray-700">
                      {item.short}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900">{item.game}</span>
                        <span className="text-[10px] text-gray-400 font-mono">#{item.period}</span>
                      </div>
                      <p className="text-[10px] text-gray-500">{item.select}</p>
                      <span className="text-[9px] text-gray-400">{item.time}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        item.status === 'WON'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'LOST'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="text-xs font-black mt-1">
                      {item.status === 'WON' ? (
                        <span className="text-emerald-600">+₹{item.payout}</span>
                      ) : item.status === 'LOST' ? (
                        <span className="text-rose-500">-₹{item.amount}</span>
                      ) : (
                        <span className="text-amber-600">₹{item.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: TRANSACTIONS (LIVE RECHARGES, WITHDRAWALS, CHECK-INS)          */}
        {/* ===================================================================== */}
        {activeTab === 'transactions' && (
          <div className="mt-3 space-y-2">
            {isTxnsLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2">
                <Loader2 size={20} className="animate-spin text-[#8B3A13]" />
                <span className="text-xs">Loading ledger...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 mb-2.5">
                  <CreditCard size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">No Transactions Yet</h4>
                <p className="text-[11px] text-gray-500 max-w-xs mt-0.5">
                  Your recharge, withdrawal, and check-in streak records will appear here.
                </p>
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="mt-3 px-4 py-1.5 bg-[#2196f3] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowDownLeft size={12} />
                  <span>Recharge Wallet</span>
                </button>
              </div>
            ) : (
              transactions.map((txn) => (
                <div
                  key={txn._id || txn.id}
                  className="bg-white rounded-xl p-3 border border-gray-200/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        txn.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {txn.isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900">{txn.title || txn.type}</span>
                      <p className="text-[10px] text-gray-500">{txn.method}</p>
                      <span className="text-[9px] text-gray-400">{formatRelativeTime(txn.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-sm font-black ${
                        txn.isPositive ? 'text-emerald-600' : 'text-gray-900'
                      }`}
                    >
                      {txn.isPositive ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                    </span>
                    <span
                      className={`text-[9px] font-bold block mt-0.5 ${
                        txn.status === 'SUCCESS'
                          ? 'text-emerald-600'
                          : txn.status === 'FAILED'
                          ? 'text-rose-500'
                          : 'text-amber-500'
                      }`}
                    >
                      ● {txn.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PASSBOOK (SAVED BANK & UPI ACCOUNTS)                            */}
        {/* ===================================================================== */}
        {activeTab === 'passbook' && (
          <div className="mt-3 space-y-2.5">
            
            {/* Header / Add Button */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Linked Payout Accounts ({bankAccounts.length})
              </span>
              <button
                onClick={() => setShowAddBankModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#8B3A13] hover:text-[#6E2C0D] cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Bank / UPI</span>
              </button>
            </div>

            {/* Bank Accounts List */}
            {bankAccounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#8B3A13] mb-2.5">
                  <Building2 size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">No Payout Accounts Linked</h4>
                <p className="text-[11px] text-gray-500 max-w-xs mt-0.5">
                  Add your Bank Account or UPI ID to easily withdraw your winnings.
                </p>
                <button
                  onClick={() => setShowAddBankModal(true)}
                  className="mt-3 px-4 py-1.5 bg-[#8B3A13] hover:bg-[#742E0E] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Add Bank / UPI</span>
                </button>
              </div>
            ) : (
              bankAccounts.map((acc) => (
                <div
                  key={acc._id || acc.id}
                  className="bg-white rounded-xl p-3.5 border border-gray-200/80 shadow-xs relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                        {acc.type === 'BANK' ? <Building2 size={18} /> : <QrCode size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-gray-900">{acc.bankName}</h4>
                          {acc.isPrimary && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono font-bold text-gray-800 mt-0.5">
                          {acc.type === 'BANK' && acc.accountNumber.length > 4
                            ? `•••• •••• ${acc.accountNumber.slice(-4)}`
                            : acc.accountNumber}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                          <span>Holder: <strong>{acc.holderName}</strong></span>
                          {acc.type === 'BANK' && acc.ifsc && <span>IFSC: {acc.ifsc}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                      {acc._id && (
                        <button
                          onClick={() => handleDeleteBankAccount(acc._id)}
                          className="text-[10px] text-gray-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                          title="Remove Account"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Withdraw Prompt */}
            <div className="p-3 bg-gray-100/70 rounded-xl flex items-center justify-between text-xs">
              <span className="text-gray-600 text-[11px]">Direct IMPS & UPI Payouts</span>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="text-xs font-bold text-[#8B3A13] hover:underline cursor-pointer"
              >
                Withdraw Funds &rarr;
              </button>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: SECURITY & SETTINGS                                            */}
        {/* ===================================================================== */}
        {activeTab === 'security' && (
          <div className="mt-3 space-y-2">
            
            {/* PIN & Password */}
            <div
              onClick={() => showToast('Payment PIN is active and verified')}
              className="bg-white rounded-xl p-3 border border-gray-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Payment PIN & Password</h4>
                  <p className="text-[10px] text-gray-500">2-Factor Payout Security</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400" />
            </div>

            {/* Live Support */}
            <div
              onClick={() => showToast('Telegram: @JannatSupportBot (24/7)')}
              className="bg-white rounded-xl p-3 border border-gray-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">24/7 Live Support</h4>
                  <p className="text-[10px] text-gray-500">Official Telegram Channel</p>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400" />
            </div>

            {/* Logout Trigger */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full mt-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD BANK ACCOUNT / UPI MODAL (SYNCED WITH BACKEND)               */}
      {/* ========================================================================= */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <h3 className="font-bold text-sm text-gray-900">Add Payout Account</h3>
              <button
                onClick={() => setShowAddBankModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setNewBank({ ...newBank, type: 'BANK' })}
                className={`py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  newBank.type === 'BANK'
                    ? 'border-[#8B3A13] bg-[#8B3A13]/10 text-[#8B3A13]'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                Bank Account
              </button>
              <button
                type="button"
                onClick={() => setNewBank({ ...newBank, type: 'UPI' })}
                className={`py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  newBank.type === 'UPI'
                    ? 'border-[#8B3A13] bg-[#8B3A13]/10 text-[#8B3A13]'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                UPI ID / VPA
              </button>
            </div>

            <form onSubmit={handleAddBankAccount} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Kumar"
                  value={newBank.holderName}
                  onChange={(e) => setNewBank({ ...newBank, holderName: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#8B3A13]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">
                  {newBank.type === 'BANK' ? 'Bank Name' : 'UPI Provider Name'}
                </label>
                <input
                  type="text"
                  placeholder={newBank.type === 'BANK' ? 'e.g. State Bank of India' : 'e.g. Google Pay / Paytm'}
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#8B3A13]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">
                  {newBank.type === 'BANK' ? 'Account Number' : 'UPI ID / VPA'}
                </label>
                <input
                  type="text"
                  placeholder={newBank.type === 'BANK' ? 'e.g. 501004928192' : 'e.g. mobile@upi'}
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#8B3A13]"
                  required
                />
              </div>

              {newBank.type === 'BANK' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-700">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001234"
                    value={newBank.ifsc}
                    onChange={(e) => setNewBank({ ...newBank, ifsc: e.target.value.toUpperCase() })}
                    className="w-full mt-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs uppercase focus:outline-none focus:border-[#8B3A13]"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingBank}
                className="w-full mt-3 py-2 bg-[#8B3A13] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSavingBank ? 'Saving to Database...' : 'Save Payout Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECHARGE DRAWER (SYNCED WITH BACKEND)                            */}
      {/* ========================================================================= */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <h3 className="font-bold text-sm text-gray-900">Recharge Balance</h3>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 300, 500, 1000, 2000, 5000, 10000, 20000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setRechargeAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      rechargeAmount === amt
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['UPI-Fast', 'Paytm QR', 'USDT'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setRechargeChannel(ch)}
                    className={`p-1.5 rounded-lg border text-[11px] font-bold text-center cursor-pointer transition-all ${
                      rechargeChannel === ch
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRechargeSubmit}
                disabled={isRecharging}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isRecharging ? 'Processing Recharge...' : `Pay ₹${rechargeAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WITHDRAW DRAWER (SYNCED WITH BACKEND)                            */}
      {/* ========================================================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
              <h3 className="font-bold text-sm text-gray-900">Withdraw Cash</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-gray-500">Available Balance:</span>
                <span className="font-extrabold text-gray-900">₹{displayBalance}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700">Withdraw Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Min ₹200"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-[#8B3A13]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">Select Linked Account</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setShowAddBankModal(true);
                    }}
                    className="text-[10px] font-bold text-[#8B3A13] hover:underline"
                  >
                    + Add New
                  </button>
                </div>

                {bankAccounts.length === 0 ? (
                  <div className="mt-2 p-3 border border-dashed border-amber-300 rounded-xl bg-amber-50/50 text-center">
                    <p className="text-[11px] text-[#78350F] font-medium">
                      No linked accounts. Please add an account to withdraw.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowWithdrawModal(false);
                        setShowAddBankModal(true);
                      }}
                      className="mt-1.5 px-3 py-1 bg-[#8B3A13] text-white rounded-lg text-[10px] font-bold"
                    >
                      Add Bank / UPI
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 mt-1 max-h-40 overflow-y-auto">
                    {bankAccounts.map((acc) => (
                      <div
                        key={acc._id || acc.id}
                        onClick={() => setWithdrawMethod(acc._id)}
                        className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          withdrawMethod === acc._id
                            ? 'border-[#8B3A13] bg-[#8B3A13]/5 shadow-xs'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <span className="font-bold">{acc.bankName}</span>
                          <span className="text-gray-500 text-[11px] block font-mono">
                            {acc.type === 'BANK' && acc.accountNumber.length > 4
                              ? `•••• ${acc.accountNumber.slice(-4)}`
                              : acc.accountNumber}
                          </span>
                        </div>
                        {withdrawMethod === acc._id && (
                          <Check size={14} className="text-[#8B3A13]" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleWithdrawSubmit}
                disabled={isWithdrawing}
                className="w-full mt-2 py-2.5 bg-[#8B3A13] hover:bg-[#742E0E] text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isWithdrawing ? 'Processing Payout...' : 'Confirm Payout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: LOGOUT MODAL                                                     */}
      {/* ========================================================================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-xl text-center">
            <h3 className="font-bold text-sm text-gray-900">Log Out of Jannat?</h3>
            <p className="text-xs text-gray-500 mt-1">You will need to sign back in to access your wallet.</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
