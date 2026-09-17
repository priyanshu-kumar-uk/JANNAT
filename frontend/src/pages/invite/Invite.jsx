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

// Initial Commission Records matching screenshot
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
  { rank: 1, name: '98***410', income: '₹98,420.50', invites: 432, badge: 'gold' },
  { rank: 2, name: '77***892', income: '₹64,150.00', invites: 310, badge: 'silver' },
  { rank: 3, name: '91***015', income: '₹42,800.20', invites: 205, badge: 'bronze' },
  { rank: 4, name: '83***221', income: '₹28,640.00', invites: 154 },
  { rank: 5, name: '62***780', income: '₹19,250.00', invites: 98 },
  { rank: 6, name: '95***433', income: '₹14,920.00', invites: 76 },
];

const Invite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Screen View: 'main' (Middle Panel) or 'inviteLink' (Right Panel)
  const [currentView, setCurrentView] = useState('main');

  // Stats & Agent Balance State
  const [agentAmount, setAgentAmount] = useState(56.264);
  const [invitedToday] = useState(2);
  const [totalInvited] = useState(1691);
  const [todayIncome] = useState(13.74);
  const [totalIncome] = useState(2906.44);

  // Modals
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showGrowthPlanModal, setShowGrowthPlanModal] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Withdrawal form state
  const [withdrawInput, setWithdrawInput] = useState('');
  const [withdrawTarget, setWithdrawTarget] = useState('wallet'); // 'wallet' | 'bank'
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Feedback State
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [recordFilter, setRecordFilter] = useState('ALL'); // 'ALL' | 'LV1' | 'LV2' | 'LV3'
  const [commissions, setCommissions] = useState(INITIAL_COMMISSIONS);

  // Referral Information
  const inviteCode = '9Vml';
  const referralNo = user?._id?.slice(-8) || 'luckymG4j';
  const domain = 'www.fiewin.com';

  const myInviteLink = `${domain}/#/L?no=${referralNo}&ic=${inviteCode}`;
  const luckyRupeeLink = `${domain}/#/L?event=luckyRupee&no=${referralNo}&ic=${inviteCode}`;
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
          title: 'Join FieWin / Jannat & Win Cash Daily!',
          text: `Use my invite link to register and get instant ₹10 welcome bonus!`,
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
    <div className="w-full min-h-full bg-[#FAF8F5] flex flex-col font-sans select-none pb-20 text-gray-800 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#16120E]/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in-95">
          <Sparkles size={13} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: MAIN INVITE DASHBOARD (MIDDLE SCREEN IN IMAGE)                     */}
      {/* ========================================================================= */}
      {currentView === 'main' && (
        <div className="w-full flex flex-col">
          {/* Header Bar */}
          <header className="w-full px-4 py-3 bg-[#16100D] text-white flex items-center justify-between sticky top-0 z-30 shadow-md border-b border-[#2C1D15]">
            {/* Left spacer for perfect centering */}
            <div className="w-16" />

            {/* Title */}
            <h1 className="text-base font-bold text-white tracking-wide">Invite</h1>

            {/* Support Pill Button */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="flex items-center gap-1.5 bg-[#231A15] hover:bg-[#2F231D] text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#0088ff] flex items-center justify-center text-white">
                <Send size={9} className="-ml-0.5" />
              </div>
              <span>Support</span>
            </button>
          </header>

          {/* Guest Mode Notice */}
          {!isAuthenticated && (
            <div className="w-full bg-amber-50 border-b border-amber-200/60 px-4 py-2 flex items-center justify-between text-xs text-[#78350F]">
              <div className="flex items-center gap-1.5 font-medium text-[11px]">
                <ShieldCheck size={12} className="text-amber-700" />
                <span>Login to track your real referral commissions</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-2.5 py-0.5 bg-[#8B3A13] text-white font-bold text-[10px] rounded-md shadow-xs active:scale-95 cursor-pointer"
              >
                Login
              </button>
            </div>
          )}

          <div className="p-3.5 space-y-3">
            {/* 1. Agent Amount Card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Agent amount</span>
                <div className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-baseline gap-1 font-mono">
                  <span>₹</span>
                  <span>{agentAmount.toFixed(3)}</span>
                </div>
              </div>

              {/* Orange Pill Withdraw Button */}
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-5 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FA8C16] hover:brightness-105 active:scale-95 text-white font-bold text-xs rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                Withdraw
              </button>
            </div>

            {/* 2. Three Feature Grid Buttons: Privilege | Ranking | My Link */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Button 1: Privilege (Red-Orange Gradient) */}
              <button
                onClick={() => setShowPrivilegeModal(true)}
                className="bg-gradient-to-br from-[#FF5C37] to-[#FA541C] text-white rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Gem size={17} className="text-white" />
                </div>
                <span className="text-xs font-bold tracking-tight">Privilege</span>
              </button>

              {/* Button 2: Ranking (Vibrant Sky Blue Gradient) */}
              <button
                onClick={() => setShowRankingModal(true)}
                className="bg-gradient-to-br from-[#1890FF] to-[#0070E0] text-white rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Trophy size={17} className="text-white" />
                </div>
                <span className="text-xs font-bold tracking-tight">Ranking</span>
              </button>

              {/* Button 3: My Link (Emerald Green Gradient) -> Opens Panel 3 */}
              <button
                onClick={() => setCurrentView('inviteLink')}
                className="bg-gradient-to-br from-[#00C48C] to-[#10B981] text-white rounded-xl p-3 flex flex-col items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Link2 size={17} className="text-white" />
                </div>
                <span className="text-xs font-bold tracking-tight">My Link</span>
              </button>
            </div>

            {/* 3. Agent Million Cash Growth Plan Banner */}
            <div
              onClick={() => setShowGrowthPlanModal(true)}
              className="w-full bg-gradient-to-r from-[#171B26] via-[#1F2436] to-[#2B2138] rounded-2xl p-4 shadow-sm border border-amber-500/20 flex items-center justify-between cursor-pointer hover:border-amber-500/40 active:scale-[0.99] transition-all relative overflow-hidden"
            >
              {/* Background ambient lighting */}
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="z-10">
                <div className="text-sm font-black text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Agent million</span>
                </div>
                <div className="text-sm font-black text-white tracking-wide mt-0.5">
                  cash growth plan
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-amber-300/80 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                  <span>Up to ₹10,00,000 Cash</span>
                  <ChevronRight size={11} />
                </div>
              </div>

              {/* 3D Gold Treasure Chest / Diamond Badge */}
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center z-10 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#2A1D0B] flex items-center justify-center">
                  <Gift size={26} className="text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* 4. Invited Today & Today's Income Stats Section */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex items-center divide-x divide-gray-100">
              {/* Left Column: Invited today */}
              <div className="flex-1 pr-3">
                <span className="text-xs text-gray-400 font-medium block">Invited today</span>
                <div className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                  {invitedToday}
                </div>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <span>Total {totalInvited}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] font-black">
                    ›
                  </div>
                </button>
              </div>

              {/* Right Column: Today's income */}
              <div className="flex-1 pl-4">
                <span className="text-xs text-gray-400 font-medium block">Today's income</span>
                <div className="text-2xl font-black text-gray-900 tracking-tight mt-0.5 font-mono">
                  ₹{todayIncome.toFixed(2)}
                </div>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 hover:text-amber-700 transition-colors cursor-pointer"
                >
                  <span>Total ₹{totalIncome.toFixed(2)}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[8px] font-black">
                    ›
                  </div>
                </button>
              </div>
            </div>

            {/* 5. Income Details Section */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
              {/* Section Title Row */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <h2 className="text-sm font-bold text-gray-900">Income details</h2>
                <button
                  onClick={() => setShowRecordsModal(true)}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center"
                >
                  <span>more</span>
                  <ChevronRight size={13} className="ml-0.5" />
                </button>
              </div>

              {/* Commissions List */}
              <div className="divide-y divide-gray-50">
                {commissions.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    {/* Left: LV Badge & Details */}
                    <div className="flex items-center gap-2.5">
                      {/* Orange Circular Level Badge */}
                      <div className="w-8 h-8 rounded-full bg-[#FA8C16]/15 border border-[#FA8C16]/30 flex flex-col items-center justify-center text-[#D46B08] shrink-0">
                        <span className="text-[9px] font-black leading-none">LV.{item.level}</span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-gray-800">{item.title}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          <span>{item.time}</span>
                          <span className="mx-1.5">from</span>
                          <span className="font-mono">{item.userRef}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Commission Amount */}
                    <div className="text-xs font-black text-gray-900 font-mono">
                      +₹{item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INVITE LINK SCREEN (RIGHT PANEL IN IMAGE)                         */}
      {/* ========================================================================= */}
      {currentView === 'inviteLink' && (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#1C6EFF] via-[#1762EA] to-[#0A4BBF] text-white flex flex-col">
          {/* Header Bar */}
          <header className="w-full px-4 py-3 bg-white text-gray-900 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <button
              onClick={() => setCurrentView('main')}
              className="w-8 h-8 -ml-2 rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>

            <h1 className="text-base font-bold text-gray-900 tracking-tight">Invite Link</h1>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <QrCode size={18} />
            </button>
          </header>

          <div className="p-4 space-y-6 flex-1 flex flex-col justify-start">
            {/* Top Yellow Bonus Notice */}
            <div className="text-center pt-2">
              <p className="text-[#FFEB3B] font-semibold text-xs tracking-wide">
                *The invitee will get ₹10 reward
              </p>
            </div>

            {/* CARD 1: My invite link */}
            <div className="space-y-2.5">
              <div className="text-center text-sm font-bold text-white tracking-wide">
                My invite link
              </div>

              {/* Link Display Box */}
              <div className="w-full bg-[#1855CA]/60 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-center text-blue-100 font-mono text-xs select-all break-all shadow-inner">
                {myInviteLink}
              </div>

              {/* Yellow Golden Action Button */}
              <button
                onClick={() => handleNativeShare(myInviteLink, 'myInvite')}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFC107] to-[#FF9800] hover:from-[#FFB300] hover:to-[#F57C00] text-[#3E2723] text-sm font-black rounded-xl shadow-lg shadow-black/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                <span>
                  {copiedKey === 'myInvite' ? 'Link Copied!' : 'Copy link and share'}
                </span>
              </button>
            </div>

            {/* CARD 2: Lucky Rupee link */}
            <div className="space-y-2.5 pt-2">
              <div className="text-center text-sm font-bold text-white tracking-wide">
                Lucky Rupee link
              </div>

              {/* Link Display Box */}
              <div className="w-full bg-[#1855CA]/60 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-center text-blue-100 font-mono text-xs select-all break-all shadow-inner">
                {luckyRupeeLink}
              </div>

              {/* Yellow Golden Action Button */}
              <button
                onClick={() => handleNativeShare(luckyRupeeLink, 'luckyRupee')}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFC107] to-[#FF9800] hover:from-[#FFB300] hover:to-[#F57C00] text-[#3E2723] text-sm font-black rounded-xl shadow-lg shadow-black/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                <span>
                  {copiedKey === 'luckyRupee' ? 'Link Copied!' : 'Copy link and share'}
                </span>
              </button>
            </div>

            {/* CARD 3: FieWin / Jannat introduction invitation */}
            <div className="space-y-2.5 pt-2">
              <div className="text-center text-sm font-bold text-white tracking-wide">
                FieWin introduction invitation
              </div>

              {/* Link Display Box */}
              <div className="w-full bg-[#1855CA]/60 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-center text-blue-100 font-mono text-xs select-all break-all shadow-inner">
                {introInviteLink}
              </div>

              {/* Yellow Golden Action Button */}
              <button
                onClick={() => handleNativeShare(introInviteLink, 'intro')}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFC107] to-[#FF9800] hover:from-[#FFB300] hover:to-[#F57C00] text-[#3E2723] text-sm font-black rounded-xl shadow-lg shadow-black/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Copy size={16} />
                <span>
                  {copiedKey === 'intro' ? 'Link Copied!' : 'Copy link and share'}
                </span>
              </button>
            </div>

            {/* Quick Social Sharing Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-around text-center text-xs">
              <button
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Join FieWin with my link & get ₹10 instant bonus: ${myInviteLink}`
                  )}`;
                  window.open(url, '_blank');
                }}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-white cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md">
                  <PhoneCall size={18} className="text-white" />
                </div>
                <span className="text-[10px]">WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const url = `https://t.me/share/url?url=${encodeURIComponent(
                    myInviteLink
                  )}&text=${encodeURIComponent('Join FieWin and earn real money daily!')}`;
                  window.open(url, '_blank');
                }}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-white cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#0088CC] flex items-center justify-center shadow-md">
                  <Send size={18} className="text-white -ml-0.5" />
                </div>
                <span className="text-[10px]">Telegram</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="flex flex-col items-center gap-1 text-white/90 hover:text-white cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-md border border-white/30">
                  <QrCode size={18} className="text-white" />
                </div>
                <span className="text-[10px]">QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: WITHDRAW AGENT AMOUNT MODAL                                      */}
      {/* ========================================================================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF7A00] to-[#FA8C16] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight size={18} />
                <h3 className="font-bold text-sm">Withdraw Agent Amount</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleWithdrawAgentAmount} className="p-4 space-y-3.5">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5">
                <span className="text-xs text-orange-800 font-medium">Available Agent Commission</span>
                <div className="text-2xl font-black text-orange-950 font-mono mt-0.5">
                  ₹{agentAmount.toFixed(3)}
                </div>
              </div>

              {/* Target Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Withdrawal Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawTarget('wallet')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      withdrawTarget === 'wallet'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    Game Wallet (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawTarget('bank')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      withdrawTarget === 'bank'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    Bank / UPI
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Amount (Min ₹10)
                </label>
                <div className="flex items-center gap-1.5 border-b-2 border-gray-200 pb-1.5 focus-within:border-orange-500">
                  <span className="text-xl font-bold text-gray-900">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter withdrawal amount"
                    value={withdrawInput}
                    onChange={(e) => setWithdrawInput(e.target.value)}
                    className="w-full text-xl font-black text-gray-900 bg-transparent outline-hidden font-mono"
                    required
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 mt-2.5">
                  {[10, 30, 50, Math.floor(agentAmount)].map((chipVal) => (
                    <button
                      key={chipVal}
                      type="button"
                      onClick={() => setWithdrawInput(chipVal.toString())}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      {chipVal === Math.floor(agentAmount) ? 'Max' : `₹${chipVal}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessingWithdraw}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FA8C16] hover:brightness-105 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingWithdraw ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Withdrawal...</span>
                  </>
                ) : (
                  <span>Confirm Withdrawal</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRIVILEGE / 3-TIER COMMISSION RULES MODAL                        */}
      {/* ========================================================================= */}
      {showPrivilegeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#FF5C37] to-[#FA541C] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem size={18} />
                <h3 className="font-bold text-sm">Agent Privilege & Tiers</h3>
              </div>
              <button
                onClick={() => setShowPrivilegeModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-gray-700">
              <div className="p-3 bg-orange-50 border border-orange-100 rounded-2xl">
                <span className="font-bold text-orange-900 block text-xs">
                  Lifetime 3-Tier Multi-Level Commission
                </span>
                <p className="text-[11px] text-orange-800 mt-0.5 leading-relaxed">
                  Earn passive commission every time your friends play in any game on FieWin!
                </p>
              </div>

              {/* Commission Breakdown Cards */}
              <div className="space-y-2">
                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-black flex items-center justify-center text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">Level 1 Commission</h4>
                      <p className="text-[10px] text-gray-400">Directly invited friends</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-orange-600 font-mono">40%</span>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">Level 2 Commission</h4>
                      <p className="text-[10px] text-gray-400">Invited by your Level 1</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-blue-600 font-mono">20%</span>
                </div>

                <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-black flex items-center justify-center text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">Level 3 Commission</h4>
                      <p className="text-[10px] text-gray-400">Invited by your Level 2</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-emerald-600 font-mono">10%</span>
                </div>
              </div>

              {/* Extra Perks */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5">
                <span className="font-bold text-gray-900 block text-xs">Agent Privileges:</span>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Real-time instant settlement every round</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Zero withdrawal fee for agent amount</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-600">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Exclusive agent growth cash bonuses up to ₹10,00,000</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPrivilegeModal(false);
                  setCurrentView('inviteLink');
                }}
                className="w-full py-3 bg-gradient-to-r from-[#FF5C37] to-[#FA541C] text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer text-center"
              >
                Share My Link Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RANKING / AGENT LEADERBOARD MODAL                                */}
      {/* ========================================================================= */}
      {showRankingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#1890FF] to-[#0070E0] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} />
                <h3 className="font-bold text-sm">Agent Leaderboard</h3>
              </div>
              <button
                onClick={() => setShowRankingModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2">
              <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                <span>Top agent earners today</span>
                <span className="text-blue-600 font-bold">Daily Refresh</span>
              </div>

              {LEADERBOARD_USERS.map((agent) => (
                <div
                  key={agent.rank}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    agent.rank === 1
                      ? 'bg-amber-50/60 border-amber-200'
                      : agent.rank === 2
                      ? 'bg-slate-50 border-slate-200'
                      : agent.rank === 3
                      ? 'bg-orange-50/50 border-orange-200'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank icon / number */}
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                      {agent.rank === 1 ? (
                        <Crown size={20} className="text-amber-500" />
                      ) : agent.rank === 2 ? (
                        <Award size={20} className="text-slate-400" />
                      ) : agent.rank === 3 ? (
                        <Award size={20} className="text-amber-700" />
                      ) : (
                        <span className="text-gray-400 font-bold">#{agent.rank}</span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-gray-900 font-mono">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-gray-400">{agent.invites} active invites</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-gray-900 font-mono">
                      {agent.income}
                    </span>
                    <span className="text-[9px] text-emerald-600 block font-semibold">Earned</span>
                  </div>
                </div>
              ))}

              {/* My Rank Summary */}
              <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 font-medium">Your Rank: #142</span>
                  <div className="text-xs font-bold text-gray-900 font-mono">
                    Today: ₹{todayIncome.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRankingModal(false);
                    setCurrentView('inviteLink');
                  }}
                  className="px-3 py-1.5 bg-[#0070E0] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer active:scale-95"
                >
                  Boost Rank
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: AGENT MILLION CASH GROWTH PLAN MODAL                             */}
      {/* ========================================================================= */}
      {showGrowthPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#171B26] via-[#1F2436] to-[#2B2138] p-4 text-white flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm text-amber-200">Agent Million Growth Plan</h3>
              </div>
              <button
                onClick={() => setShowGrowthPlanModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-3 rounded-2xl border border-amber-500/20">
                <span className="text-xs font-bold text-amber-900 block">
                  Cumulative Invite Milestones
                </span>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Reach player milestones and claim direct cash rewards credited to your balance.
                </p>
              </div>

              <div className="space-y-2">
                {GROWTH_PLAN_STAGES.map((st) => (
                  <div
                    key={st.stage}
                    className="p-3 bg-white border border-gray-100 rounded-xl shadow-2xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">
                          Stage {st.stage}: Invite {st.invitesNeeded} users
                        </span>
                      </div>
                      <span className="text-xs font-black text-amber-600 font-mono mt-0.5 block">
                        Reward: +₹{st.reward.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      {st.status === 'CLAIMED' ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Claimed ✓
                        </span>
                      ) : st.status === 'IN_PROGRESS' ? (
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          {st.current}/{st.invitesNeeded}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowGrowthPlanModal(false);
                  setCurrentView('inviteLink');
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer text-center"
              >
                Invite Friends to Unlock Next Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: MORE RECORDS / FULL COMMISSION LOGS                              */}
      {/* ========================================================================= */}
      {showRecordsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Commission History</h3>
              <button
                onClick={() => setShowRecordsModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="p-3 border-b border-gray-100 flex items-center gap-1.5">
              {['ALL', 'LV1', 'LV2', 'LV3'].map((filt) => (
                <button
                  key={filt}
                  onClick={() => setRecordFilter(filt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    recordFilter === filt
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filt === 'ALL' ? 'All' : `Level ${filt.replace('LV', '')}`}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto divide-y divide-gray-100 space-y-2">
              {filteredCommissions.map((rec) => (
                <div key={rec.id} className="pt-2 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-[9px]">
                      LV.{rec.level}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{rec.title}</div>
                      <div className="text-[10px] text-gray-400">
                        {rec.time} • from {rec.userRef}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-900 font-mono">
                    +₹{rec.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: QR CODE SHARING MODAL                                            */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl border border-gray-100 p-5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900">Scan to Join FieWin</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* QR Pattern Display */}
            <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-xs inline-block my-2">
              <div className="w-44 h-44 bg-[#FAF8F5] border border-gray-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 gap-1.5 p-3 opacity-80">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-xs ${
                        i % 2 === 0 || i % 7 === 0 || i === 0 || i === 5 || i === 30
                          ? 'bg-gray-900'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {/* Center Brand Badge */}
                <div className="absolute inset-0 m-auto w-10 h-10 bg-orange-500 rounded-lg border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                  F
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-1 font-mono">Invite Code: {inviteCode}</p>

            <button
              onClick={() => copyToClipboard(myInviteLink, 'qr')}
              className="w-full mt-3 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {copiedKey === 'qr' ? 'Link Copied!' : 'Copy Invite Link'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: SUPPORT MODAL                                                    */}
      {/* ========================================================================= */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#0088ff] flex items-center justify-center text-white">
                  <Send size={12} className="-ml-0.5" />
                </div>
                <h3 className="font-bold text-sm text-gray-900">FieWin Agent Support</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-0.5">24/7 Official Agent Telegram</h4>
                <p className="text-[11px] text-blue-700">
                  Contact our dedicated agent managers for high-volume partnerships, custom commission
                  rates, and instant payouts.
                </p>
              </div>

              <div
                onClick={() => {
                  window.open('https://t.me/fiewin_official', '_blank');
                  showToast('Opening Telegram Channel...');
                }}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Send size={16} className="text-[#0088cc]" />
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">Official Channel</span>
                    <span className="text-[10px] text-gray-400">@FieWin_Official</span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </div>

              <div
                onClick={() => {
                  window.open('https://t.me/fiewin_support_bot', '_blank');
                  showToast('Opening Support Bot...');
                }}
                className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-emerald-600" />
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">Agent Help Bot</span>
                    <span className="text-[10px] text-gray-400">@FieWin_AgentSupportBot</span>
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