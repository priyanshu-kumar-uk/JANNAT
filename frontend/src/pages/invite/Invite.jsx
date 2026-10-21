import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Gem,
  Trophy,
  Link2,
  Copy,
  Sparkles,
  X,
  PhoneCall,
  Send,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  ExternalLink,
  Award,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { updateWalletBalance } from '../../store/slices/authSlice';

// Initial Commission Records
const INITIAL_COMMISSIONS = [
  {
    id: 'COM-998124',
    level: 3,
    title: 'level-3 Order commission',
    time: '08/17 04:02',
    userRef: '9685140',
    amount: 0.3,
  },
  {
    id: 'COM-998123',
    level: 3,
    title: 'level-3 Order commission',
    time: '08/17 04:01',
    userRef: '9685140',
    amount: 0.3,
  },
  {
    id: 'COM-998118',
    level: 2,
    title: 'level-2 Order commission',
    time: '08/17 03:48',
    userRef: '8819230',
    amount: 0.6,
  },
  {
    id: 'COM-998099',
    level: 1,
    title: 'level-1 Order commission',
    time: '08/17 03:15',
    userRef: '7741029',
    amount: 1.2,
  },
  {
    id: 'COM-998075',
    level: 1,
    title: 'level-1 Order commission',
    time: '08/17 02:40',
    userRef: '6391204',
    amount: 1.5,
  },
  {
    id: 'COM-998042',
    level: 3,
    title: 'level-3 Order commission',
    time: '08/17 01:22',
    userRef: '4198201',
    amount: 0.3,
  },
  {
    id: 'COM-997992',
    level: 2,
    title: 'level-2 Order commission',
    time: '08/16 23:55',
    userRef: '5519803',
    amount: 0.6,
  },
];

// Agent Growth Plan Milestones
const GROWTH_PLAN_STAGES = [
  { stage: 1, invitesNeeded: 1, reward: 10, status: 'CLAIMED' },
  { stage: 2, invitesNeeded: 5, reward: 50, status: 'CLAIMED' },
  { stage: 3, invitesNeeded: 20, reward: 300, status: 'IN_PROGRESS', current: 2 },
  { stage: 4, invitesNeeded: 50, reward: 1500, status: 'LOCKED' },
  { stage: 5, invitesNeeded: 100, reward: 5000, status: 'LOCKED' },
  { stage: 6, invitesNeeded: 500, reward: 50000, status: 'LOCKED' },
  { stage: 7, invitesNeeded: 1000, reward: 100000, status: 'LOCKED' },
  { stage: 8, invitesNeeded: 5000, reward: 1000000, status: 'LOCKED' },
];

// Agent Leaderboard
const LEADERBOARD_USERS = [
  { rank: 1, name: '98***410', income: '₹98,420.50', invites: 432 },
  { rank: 2, name: '91***209', income: '₹64,110.00', invites: 289 },
  { rank: 3, name: '87***991', income: '₹42,850.25', invites: 195 },
  { rank: 4, name: '70***443', income: '₹28,600.00', invites: 142 },
  { rank: 5, name: '99***120', income: '₹19,300.50', invites: 98 },
];

const Invite = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // View state: 'main' or 'inviteLink'
  const [currentView, setCurrentView] = useState('main');

  // Interactive Modals
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showGrowthPlanModal, setShowGrowthPlanModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Withdrawal form
  const [withdrawInput, setWithdrawInput] = useState('');
  const [withdrawTarget, setWithdrawTarget] = useState('wallet');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Filter for records modal
  const [recordFilter, setRecordFilter] = useState('ALL');

  // Simulated live stats
  const [agentAmount, setAgentAmount] = useState(74.45);
  const [invitedToday] = useState(0);
  const [totalInvited] = useState(1);
  const [todayIncome] = useState(0.0);
  const [totalIncome] = useState(74.45);
  const [commissions, setCommissions] = useState(INITIAL_COMMISSIONS);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Unique referral metadata
  const referralNo = user?.mobileNumber ? user.mobileNumber.slice(-4) : '7721';
  const inviteCode = user?._id ? user._id.slice(-6).toUpperCase() : 'Z6A48Q';
  const domain = 'https://jannat.game';

  const myInviteLink = `${domain}/#/RG?invitation=${inviteCode}`;
  const luckyRupeeLink = `${domain}/#/LR?code=${inviteCode}&from=lucky`;
  const introInviteLink = `${domain}/#/RG?no=${referralNo}&ic=${inviteCode}`;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const copyToClipboard = async (text, keyName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast('Copied link!');
    }
  };

  const handleNativeShare = async (url, title) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Jannat & Win Cash Daily!',
          text: `Use my invite link to register and get instant welcome bonus!`,
          url: url,
        });
      } catch {
        copyToClipboard(url, title);
      }
    } else {
      copyToClipboard(url, title);
    }
  };

  const handleWithdrawAgentAmount = (e) => {
    e.preventDefault();
    const num = parseFloat(withdrawInput);
    if (isNaN(num) || num <= 0) {
      showToast('Please enter a valid withdrawal amount');
      return;
    }
    if (num < 10) {
      showToast('Minimum withdrawal amount is ₹10');
      return;
    }
    if (num > agentAmount) {
      showToast('Insufficient agent balance');
      return;
    }

    setIsProcessingWithdraw(true);
    setTimeout(() => {
      setIsProcessingWithdraw(false);
      const newBalance = agentAmount - num;
      setAgentAmount(parseFloat(newBalance.toFixed(3)));

      if (withdrawTarget === 'wallet') {
        dispatch(updateWalletBalance(num));
        showToast(`₹${num.toFixed(2)} transferred to your Game Wallet!`);
      } else {
        showToast(`Withdrawal request of ₹${num.toFixed(2)} sent to bank!`);
      }

      setCommissions((prev) => [
        {
          id: `WD-${Date.now().toString().slice(-6)}`,
          level: 1,
          title: `Withdraw to ${withdrawTarget === 'wallet' ? 'Wallet' : 'Bank'}`,
          time: 'Just now',
          userRef: 'Self',
          amount: -num,
        },
        ...prev,
      ]);

      setWithdrawInput('');
      setShowWithdrawModal(false);
    }, 1000);
  };

  const filteredCommissions = commissions.filter((c) => {
    if (recordFilter === 'ALL') return true;
    if (recordFilter === 'LV1') return c.level === 1;
    if (recordFilter === 'LV2') return c.level === 2;
    if (recordFilter === 'LV3') return c.level === 3;
    return true;
  });

  return (
    <div className="w-full min-h-full bg-white flex flex-col font-sans select-none pb-20 text-black relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-800 flex items-center gap-2">
          <Sparkles size={13} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW 1: MAIN INVITE DASHBOARD */}
      {currentView === 'main' && (
        <div className="w-full flex flex-col">
          {/* Header Bar */}
          <header className="w-full px-4 py-3 bg-white text-black flex items-center justify-between sticky top-0 z-30 shadow-xs border-b border-gray-200">
            <div className="w-16" />
            <h1 className="text-base font-bold text-black tracking-wide">Invite</h1>
            <button
              onClick={() => setShowSupportModal(true)}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Send size={9} className="-ml-0.5" />
              </div>
              <span>Support</span>
            </button>
          </header>

          {/* Guest Mode Notice */}
          {!isAuthenticated && (
            <div className="w-full bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs text-black">
              <div className="flex items-center gap-1.5 font-medium text-[11px]">
                <ShieldCheck size={12} className="text-blue-600" />
                <span>Login to track your referral commissions</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-md shadow-xs active:scale-95 cursor-pointer"
              >
                Login
              </button>
            </div>
          )}

          <div className="p-3.5 space-y-3">
            {/* Agent Amount Card */}
            <div className="w-full bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs text-gray-500 font-medium block">Agent amount</span>
                <div className="text-2xl font-black text-black tracking-tight mt-1 flex items-baseline gap-1 font-mono">
                  <span>₹</span>
                  <span>{agentAmount.toFixed(3)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-full shadow-xs transition-all cursor-pointer"
              >
                Withdraw
              </button>
            </div>

            {/* Three Action Buttons: Privilege | Ranking | My Link */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setShowPrivilegeModal(true)}
                className="bg-white hover:bg-gray-50 text-black border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                  <Gem size={17} />
                </div>
                <span className="text-xs font-bold tracking-tight">Privilege</span>
              </button>

              <button
                onClick={() => setShowRankingModal(true)}
                className="bg-white hover:bg-gray-50 text-black border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                  <Trophy size={17} />
                </div>
                <span className="text-xs font-bold tracking-tight">Ranking</span>
              </button>

              <button
                onClick={() => setCurrentView('inviteLink')}
                className="bg-white hover:bg-gray-50 text-black border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-600">
                  <Link2 size={17} />
                </div>
                <span className="text-xs font-bold tracking-tight">My Link</span>
              </button>
            </div>

            {/* Cash Growth Plan Banner */}
            <div
              onClick={() => setShowGrowthPlanModal(true)}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-center justify-between cursor-pointer hover:border-blue-600 active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-sm font-black text-black uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  <span>Agent Million</span>
                </div>
                <div className="text-sm font-black text-gray-700 tracking-wide mt-0.5">
                  Cash Growth Plan
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                  <span>Up to ₹10,00,000 Cash</span>
                  <ChevronRight size={11} />
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Gift size={24} className="text-blue-600" />
              </div>
            </div>

            {/* Invited Today & Today's Income Stats Section */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-gray-200 flex items-center divide-x divide-gray-200">
              <div className="flex-1 pr-3">
                <span className="text-xs text-gray-500 font-medium block">Invited today</span>
                <div className="text-2xl font-black text-black tracking-tight mt-0.5">
                  {invitedToday}
                </div>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  <span>Total {totalInvited}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                    ›
                  </div>
                </button>
              </div>

              <div className="flex-1 pl-4">
                <span className="text-xs text-gray-500 font-medium block">Today's income</span>
                <div className="text-2xl font-black text-black tracking-tight mt-0.5 font-mono">
                  ₹{todayIncome.toFixed(2)}
                </div>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  <span>Total ₹{totalIncome.toFixed(2)}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                    ›
                  </div>
                </button>
              </div>
            </div>

            {/* Income Details Section */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-gray-200">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
                <h2 className="text-sm font-bold text-black">Income details</h2>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="text-xs text-blue-600 hover:underline transition-colors cursor-pointer flex items-center"
                >
                  <span>more</span>
                  <ChevronRight size={13} className="ml-0.5" />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {commissions.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex flex-col items-center justify-center text-blue-600 shrink-0">
                        <span className="text-[9px] font-black leading-none">LV.{item.level}</span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-black">{item.title}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          <span>{item.time}</span>
                          <span className="mx-1.5">from</span>
                          <span className="font-mono">{item.userRef}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-black text-black font-mono">
                      +₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: INVITE LINK SCREEN */}
      {currentView === 'inviteLink' && (
        <div className="w-full min-h-screen bg-white text-black flex flex-col">
          {/* Header Bar */}
          <header className="w-full px-4 py-3 bg-white text-black flex items-center justify-between sticky top-0 z-30 border-b border-gray-200">
            <button
              onClick={() => setCurrentView('main')}
              className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            <h1 className="text-base font-bold text-black tracking-tight">Invite Link</h1>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <QrCode size={18} />
            </button>
          </header>

          <div className="p-4 space-y-5 flex-1 flex flex-col justify-start">
            <div className="text-center pt-2">
              <p className="text-blue-600 font-bold text-xs tracking-wide">
                *The invitee will get ₹10 reward
              </p>
            </div>

            {/* CARD 1: My invite link */}
            <div className="space-y-2 border border-gray-200 p-3.5 rounded-2xl bg-white shadow-xs">
              <div className="text-sm font-bold text-black">
                My invite link
              </div>

              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-black font-mono text-xs select-all break-all">
                {myInviteLink}
              </div>

              <button
                onClick={() => handleNativeShare(myInviteLink, 'myInvite')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                <span>
                  {copiedKey === 'myInvite' ? 'Link Copied!' : 'Copy link and share'}
                </span>
              </button>
            </div>

            {/* CARD 2: Lucky Rupee link */}
            <div className="space-y-2 border border-gray-200 p-3.5 rounded-2xl bg-white shadow-xs">
              <div className="text-sm font-bold text-black">
                Lucky Rupee link
              </div>

              <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-black font-mono text-xs select-all break-all">
                {luckyRupeeLink}
              </div>

              <button
                onClick={() => handleNativeShare(luckyRupeeLink, 'luckyRupee')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                <span>
                  {copiedKey === 'luckyRupee' ? 'Link Copied!' : 'Copy link and share'}
                </span>
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-around text-center text-xs">
              <button
                onClick={() => copyToClipboard(myInviteLink, 'direct')}
                className="flex flex-col items-center gap-1 text-black cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Copy size={18} />
                </div>
                <span className="text-[10px]">Copy</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="flex flex-col items-center gap-1 text-black cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <QrCode size={18} />
                </div>
                <span className="text-[10px]">QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: WITHDRAW AGENT AMOUNT */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-200 text-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm">Withdraw Agent Amount</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleWithdrawAgentAmount} className="p-4 space-y-3.5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <span className="text-xs text-gray-500 font-medium">Available Agent Commission</span>
                <div className="text-2xl font-black text-black font-mono mt-0.5">
                  ₹{agentAmount.toFixed(3)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-1.5">
                  Withdrawal Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawTarget('wallet')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      withdrawTarget === 'wallet'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white border-gray-200 text-black'
                    }`}
                  >
                    Game Wallet (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawTarget('bank')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      withdrawTarget === 'bank'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white border-gray-200 text-black'
                    }`}
                  >
                    Bank / UPI
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-black block mb-1">
                  Amount (Min ₹10)
                </label>
                <div className="flex items-center gap-1.5 border-b-2 border-gray-200 pb-1.5 focus-within:border-blue-600">
                  <span className="text-xl font-bold text-black">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter withdrawal amount"
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                    className="w-full text-xl font-black text-black bg-transparent outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingWithdraw}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingWithdraw ? 'Processing Withdrawal...' : 'Confirm Withdrawal'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRIVILEGE */}
      {showPrivilegeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 text-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm">Agent Privilege & Tiers</h3>
              </div>
              <button
                onClick={() => setShowPrivilegeModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-black">
              <div className="space-y-2">
                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold">Level 1 Commission</span>
                  <span className="text-base font-black text-blue-600 font-mono">40%</span>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold">Level 2 Commission</span>
                  <span className="text-base font-black text-blue-600 font-mono">20%</span>
                </div>
                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold">Level 3 Commission</span>
                  <span className="text-base font-black text-blue-600 font-mono">10%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPrivilegeModal(false);
                  setCurrentView('inviteLink');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer text-center"
              >
                Share My Link Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RANKING */}
      {showRankingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 text-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm">Agent Leaderboard</h3>
              </div>
              <button
                onClick={() => setShowRankingModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              {LEADERBOARD_USERS.map((agent) => (
                <div
                  key={agent.rank}
                  className="p-3 rounded-xl border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 text-xs">#{agent.rank}</span>
                    <div>
                      <div className="text-xs font-bold text-black font-mono">{agent.name}</div>
                      <div className="text-[10px] text-gray-500">{agent.invites} active invites</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-black font-mono">{agent.income}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: GROWTH PLAN */}
      {showGrowthPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 text-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-blue-600" />
                <h3 className="font-bold text-sm">Growth Plan</h3>
              </div>
              <button
                onClick={() => setShowGrowthPlanModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              {GROWTH_PLAN_STAGES.map((st) => (
                <div
                  key={st.stage}
                  className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-black">
                      Stage {st.stage}: {st.invitesNeeded} users
                    </span>
                    <span className="text-xs font-black text-blue-600 font-mono block">
                      +₹{st.reward.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: RECORDS */}
      {showRecordsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-black">Commission History</h3>
              <button
                onClick={() => setShowRecordsModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-3 border-b border-gray-200 flex items-center gap-1.5">
              {['ALL', 'LV1', 'LV2', 'LV3'].map((filt) => (
                <button
                  key={filt}
                  onClick={() => setRecordFilter(filt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    recordFilter === filt
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-black hover:bg-gray-50'
                  }`}
                >
                  {filt === 'ALL' ? 'All' : `Level ${filt.replace('LV', '')}`}
                </button>
              ))}
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-gray-100 space-y-2">
              {filteredCommissions.map((rec) => (
                <div key={rec.id} className="pt-2 pb-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-black">{rec.title}</div>
                    <div className="text-[10px] text-gray-500">
                      {rec.time} • from {rec.userRef}
                    </div>
                  </div>
                  <span className="text-xs font-black text-black font-mono">
                    +₹{rec.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: QR CODE */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl border border-gray-200 p-5 text-center">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-black">Invite QR</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl inline-block my-2">
              <div className="w-40 h-40 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-5 gap-1.5 p-3 opacity-80">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-xs ${
                        i % 2 === 0 ? 'bg-black' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 m-auto w-10 h-10 bg-blue-600 rounded-lg border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                  J
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1 font-mono">Code: {inviteCode}</p>

            <button
              onClick={() => copyToClipboard(myInviteLink, 'qr')}
              className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {copiedKey === 'qr' ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 7: SUPPORT */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Send size={12} className="-ml-0.5" />
                </div>
                <h3 className="font-bold text-sm text-black">Agent Support</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-black">
              <div
                onClick={() => {
                  window.open('https://t.me/JannatSupportBot', '_blank');
                  showToast('Opening Support Bot...');
                }}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-blue-600" />
                  <div>
                    <span className="font-bold text-black block text-xs">Live Agent Bot</span>
                    <span className="text-[10px] text-gray-500">@JannatSupportBot</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invite;