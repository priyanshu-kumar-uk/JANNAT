import React, { useState } from 'react';
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
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';

// Mock Bet History Data
const DUMMY_BET_HISTORY = [
  {
    id: 'BET-98214',
    game: 'Fast-Parity',
    short: 'FP',
    period: '2108231872',
    select: 'Green (2x)',
    amount: 500,
    payout: 980,
    status: 'WON',
    time: '2 mins ago',
    color: 'emerald',
  },
  {
    id: 'BET-98211',
    game: 'Fast-Parity',
    short: 'FP',
    period: '2108231871',
    select: 'Number 5 (9x)',
    amount: 100,
    payout: 0,
    status: 'LOST',
    time: '15 mins ago',
    color: 'rose',
  },
  {
    id: 'BET-98204',
    game: 'Crash',
    short: 'CR',
    period: 'CR-8840',
    select: 'Cashed out 3.42x',
    amount: 250,
    payout: 855,
    status: 'WON',
    time: '1 hour ago',
    color: 'emerald',
  },
  {
    id: 'BET-98190',
    game: 'MineSweeper',
    short: 'MS',
    period: 'MS-2041',
    select: '6 Boxes Cleared',
    amount: 200,
    payout: 540,
    status: 'WON',
    time: '3 hours ago',
    color: 'emerald',
  },
  {
    id: 'BET-98177',
    game: 'Andar Bahar',
    short: 'AB',
    period: 'AB-4309',
    select: 'Bahar (2x)',
    amount: 1000,
    payout: 0,
    status: 'LOST',
    time: 'Yesterday',
    color: 'rose',
  },
];

// Mock Transactions Data (Deposits, Withdrawals, Rewards)
const DUMMY_TRANSACTIONS = [
  {
    id: 'TXN-773901',
    type: 'Recharge',
    method: 'UPI / PhonePe',
    amount: 2000,
    status: 'SUCCESS',
    date: '16 Sep, 21:40',
    isPositive: true,
  },
  {
    id: 'TXN-773822',
    type: 'Withdrawal',
    method: 'IMPS Bank (HDFC ****4102)',
    amount: 4500,
    status: 'SUCCESS',
    date: '15 Sep, 18:22',
    isPositive: false,
  },
  {
    id: 'TXN-773704',
    type: 'Referral Bonus',
    method: 'Tier 1 Commission',
    amount: 350,
    status: 'SUCCESS',
    date: '15 Sep, 12:05',
    isPositive: true,
  },
  {
    id: 'TXN-773590',
    type: 'Daily Check-in',
    method: 'Day 5 Bonus',
    amount: 50,
    status: 'SUCCESS',
    date: '14 Sep, 09:15',
    isPositive: true,
  },
  {
    id: 'TXN-773418',
    type: 'Withdrawal',
    method: 'Paytm UPI',
    amount: 1800,
    status: 'SUCCESS',
    date: '12 Sep, 20:01',
    isPositive: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // States
  const [showBalance, setShowBalance] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'transactions' | 'passbook' | 'security'
  const [toastMessage, setToastMessage] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameFilter, setGameFilter] = useState('ALL');

  // Modals
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Bank Form State
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankName: 'HDFC Bank',
      accountNumber: '•••• •••• 4102',
      holderName: 'Piyush Kumar',
      ifsc: 'HDFC0001234',
      isPrimary: true,
      type: 'BANK',
    },
    {
      id: 2,
      bankName: 'Paytm Payments Bank',
      accountNumber: 'paytm98765@paytm',
      holderName: 'Piyush Kumar',
      ifsc: 'UPI ID',
      isPrimary: false,
      type: 'UPI',
    },
  ]);

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
  const [withdrawMethod, setWithdrawMethod] = useState('1'); // ID of bank account

  // Check-in state
  const [checkInDay, setCheckInDay] = useState(4);
  const [claimedToday, setClaimedToday] = useState(false);

  // Metadata
  const displayName = isAuthenticated ? (user?.fullName || 'Jannat Player') : 'Guest Player';
  const displayMobile = isAuthenticated ? (user?.mobileNumber || '+91 98765 43210') : 'Guest';
  const displayId = isAuthenticated ? (user?._id?.slice(-8).toUpperCase() || 'JNT88492') : 'GUEST-001';
  const displayBalance = isAuthenticated ? (user?.walletBalance ?? 1845.5).toFixed(2) : '1,845.50';
  const referralCode = isAuthenticated ? 'JANNAT777' : 'JNT-DEMO';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName}!`);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleClaimCheckIn = (day) => {
    if (claimedToday) {
      showToast("Already claimed today's bonus.");
      return;
    }
    setClaimedToday(true);
    setCheckInDay((prev) => Math.min(prev + 1, 7));
    showToast(`Claimed Day ${day} Bonus: +₹${day * 10 + 10}`);
  };

  const handleAddBankAccount = (e) => {
    e.preventDefault();
    if (!newBank.bankName || !newBank.accountNumber || !newBank.holderName) {
      showToast('Please fill all required fields');
      return;
    }

    setBankAccounts((prev) => [
      ...prev,
      {
        id: Date.now(),
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        holderName: newBank.holderName,
        ifsc: newBank.ifsc || 'UPI',
        isPrimary: false,
        type: newBank.type,
      },
    ]);

    setNewBank({ type: 'BANK', bankName: '', accountNumber: '', holderName: '', ifsc: '' });
    setShowAddBankModal(false);
    showToast('Payment account added successfully!');
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

  const filteredBets = gameFilter === 'ALL'
    ? DUMMY_BET_HISTORY
    : DUMMY_BET_HISTORY.filter((b) => b.game.toLowerCase().includes(gameFilter.toLowerCase()));

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
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => showToast('Telegram: @JannatSupportBot')}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
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
            <span>Login to access withdrawals & rewards</span>
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
      {/* 2. SOLID LUXURY PROFILE & WALLET CARD (NO MUDDY GRADIENTS)                */}
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
                    VIP 3
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
              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-medium">
                <span>Wallet Balance</span>
                <button onClick={() => setShowBalance(!showBalance)} className="cursor-pointer text-zinc-400 hover:text-zinc-200">
                  {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
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
      {/* 3. CLEAN DAILY CHECK-IN STRIP (CLEAN & SLEEK)                             */}
      {/* ========================================================================= */}
      <div className="w-full px-3.5 pt-3">
        <div className="w-full bg-white rounded-2xl p-3 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CalendarCheck size={14} className="text-[#8B3A13]" />
              <span className="text-xs font-bold text-gray-900">7-Day Streak</span>
            </div>
            <button
              onClick={() => handleClaimCheckIn(checkInDay)}
              disabled={claimedToday}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                claimedToday
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#8B3A13] text-white hover:bg-[#742E0E] active:scale-95'
              }`}
            >
              {claimedToday ? 'Claimed ✓' : 'Claim Daily'}
            </button>
          </div>

          {/* 7-Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day < checkInDay;
              const isCurrent = day === checkInDay;
              return (
                <div
                  key={day}
                  className={`py-1 rounded-lg text-center border transition-all ${
                    isPast
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                      : isCurrent
                      ? 'bg-amber-50 border-amber-400 text-[#8B3A13] font-bold'
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
                onClick={() => setActiveTab(tab.id)}
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
        {/* TAB 1: BET RECORDS                                                    */}
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
            {filteredBets.map((item) => (
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
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="text-xs font-black mt-1">
                    {item.status === 'WON' ? (
                      <span className="text-emerald-600">+₹{item.payout}</span>
                    ) : (
                      <span className="text-rose-500">-₹{item.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: TRANSACTIONS (Recharge, Withdrawal, Bonus Ledger)              */}
        {/* ===================================================================== */}
        {activeTab === 'transactions' && (
          <div className="mt-3 space-y-2">
            {DUMMY_TRANSACTIONS.map((txn) => (
              <div
                key={txn.id}
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
                    <span className="font-bold text-xs text-gray-900">{txn.type}</span>
                    <p className="text-[10px] text-gray-500">{txn.method}</p>
                    <span className="text-[9px] text-gray-400">{txn.date}</span>
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
                  <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">
                    ● {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: PASSBOOK (Linked Bank Accounts & UPI details)                  */}
        {/* ===================================================================== */}
        {activeTab === 'passbook' && (
          <div className="mt-3 space-y-2.5">
            
            {/* Add Bank Button */}
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
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
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
                        {acc.accountNumber}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                        <span>Holder: <strong>{acc.holderName}</strong></span>
                        {acc.ifsc !== 'UPI' && <span>IFSC: {acc.ifsc}</span>}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                </div>
              </div>
            ))}

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
      {/* MODAL 1: ADD BANK ACCOUNT / UPI MODAL                                     */}
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
                  placeholder="e.g. Piyush Kumar"
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
                className="w-full mt-3 py-2 bg-[#8B3A13] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer active:scale-95"
              >
                Save Bank Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECHARGE DRAWER                                                  */}
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
                    className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
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
                    className={`p-1.5 rounded-lg border text-[11px] font-bold text-center cursor-pointer ${
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
                onClick={() => {
                  setShowRechargeModal(false);
                  showToast(`Payment request generated for ₹${rechargeAmount}!`);
                }}
                className="w-full mt-2 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95"
              >
                Pay ₹{rechargeAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WITHDRAW DRAWER                                                  */}
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
                <span className="text-gray-500">Balance:</span>
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
                <label className="text-[11px] font-bold text-gray-700">Select Linked Account</label>
                <div className="space-y-1.5 mt-1">
                  {bankAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setWithdrawMethod(String(acc.id))}
                      className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                        withdrawMethod === String(acc.id)
                          ? 'border-[#8B3A13] bg-[#8B3A13]/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="font-bold">{acc.bankName}</span>
                      <span className="font-mono text-gray-500 text-[11px]">{acc.accountNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (!withdrawAmount || Number(withdrawAmount) < 200) {
                    showToast('Minimum withdrawal is ₹200');
                    return;
                  }
                  setShowWithdrawModal(false);
                  showToast(`Withdrawal of ₹${withdrawAmount} initiated!`);
                }}
                className="w-full mt-2 py-2.5 bg-[#8B3A13] text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95"
              >
                Confirm Payout
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
