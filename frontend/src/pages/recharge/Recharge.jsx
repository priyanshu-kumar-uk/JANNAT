import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronLeft,
  ShieldCheck,
  Zap,
  HelpCircle,
  Clock,
  CheckCircle2,
  Copy,
  QrCode,
  ArrowRight,
  Sparkles,
  X,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { updateWalletBalance } from '../../store/slices/authSlice';

// Authentic Payment Channel Logos (SVGs)
const GooglePayIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path fill="#4285F4" d="M43.6 20.1H42V20H24v8h11.3C33.7 33.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
      <path fill="#34A853" d="m6.3 14.7 6.6 4.8C14.7 15.6 19 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#FBBC05" d="M24 44c5.2 0 10-1.9 13.6-5.2l-6.3-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.3 0-9.7-3.5-11.3-8.2l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
      <path fill="#EA4335" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.4-2.2 4.4-4 5.8l6.3 5.2C41.2 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z" />
    </svg>
  </div>
);

const PaytmIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <div className="w-7 h-7 rounded-lg bg-[#002E6E] flex flex-col items-center justify-center p-0.5 shadow-xs">
      <span className="text-[8px] font-black text-white leading-none tracking-tighter">pay</span>
      <span className="text-[8px] font-black text-[#00B9F5] leading-none tracking-tighter">tm</span>
    </div>
  </div>
);

const PhonePeIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <div className="w-7 h-7 rounded-full bg-[#5F259F] flex items-center justify-center shadow-xs">
      <span className="text-white font-black text-xs font-serif leading-none">पे</span>
    </div>
  </div>
);

const AmazonPayIcon = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <div className="w-7 h-7 rounded-lg bg-[#232F3E] flex flex-col items-center justify-center shadow-xs relative overflow-hidden">
      <span className="text-white font-black text-[9px] leading-none">a</span>
      <span className="text-[#FF9900] font-black text-[9px] -mt-1 leading-none">⌣</span>
    </div>
  </div>
);

const PRESET_AMOUNTS = [30, 250, 700, 3500, 10000, 50000];

const INITIAL_RECORDS = [
  {
    id: 'RC99812401',
    amount: 65,
    method: 'PhonePe',
    status: 'Success',
    date: 'Today, 12:42 PM',
  },
  {
    id: 'RC99812398',
    amount: 250,
    method: 'Google Pay',
    status: 'Success',
    date: 'Yesterday, 06:15 PM',
  },
];

const Recharge = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Flow views: 'amount' (Screen 2) or 'payment' (Screen 3)
  const [view, setView] = useState('amount');

  // Form State
  const [amount, setAmount] = useState('65');
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' | 'qr'
  const [paymentMethod, setPaymentMethod] = useState('gpay'); // 'gpay' | 'paytm' | 'phonepe' | 'amazonpay'

  // Modals & Feedback
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [lastTxId, setLastTxId] = useState('');
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Live Scrolling Ticker Feed
  const tickerItems = [
    { user: '**998', amount: '50' },
    { user: '**711', amount: '250' },
    { user: '**342', amount: '1,000' },
    { user: '**620', amount: '3,500' },
    { user: '**105', amount: '700' },
    { user: '**489', amount: '10,000' },
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Balance display helper
  const walletBalance = user?.walletBalance !== undefined ? user.walletBalance : 47.0;
  const formattedBalance = walletBalance.toFixed(3);

  // Quick Amount preset click
  const handlePresetClick = (val) => {
    setAmount(val.toString());
  };

  // Handle proceed to payment selection
  const handleProceedToPayment = () => {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      showToast('Please enter a valid recharge amount');
      return;
    }
    if (num < 20) {
      showToast('Minimum recharge amount is ₹20');
      return;
    }
    setView('payment');
  };

  // Payment Confirmation & Balance Credit Simulation
  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const creditedAmount = Number(amount) || 65;
      const txId = `RC${Math.floor(10000000 + Math.random() * 90000000)}`;
      setLastTxId(txId);

      // Credit wallet in Redux store
      dispatch(updateWalletBalance(creditedAmount));

      // Append record
      const newRecord = {
        id: txId,
        amount: creditedAmount,
        method: paymentTab === 'qr' ? 'QR Code' : getMethodLabel(paymentMethod),
        status: 'Success',
        date: 'Just now',
      };
      setRecords((prev) => [newRecord, ...prev]);
    }, 1200);
  };

  const getMethodLabel = (methodId) => {
    switch (methodId) {
      case 'gpay':
        return 'Google Pay';
      case 'paytm':
        return 'Paytm';
      case 'phonepe':
        return 'PhonePe';
      case 'amazonpay':
        return 'Amazon Pay';
      default:
        return 'UPI';
    }
  };

  const closePaymentFlow = () => {
    setShowPaymentModal(false);
    setPaymentSuccess(false);
    setUtrNumber('');
    setView('amount');
  };

  return (
    <div className="w-full min-h-full bg-[#FAF8F5] flex flex-col font-sans select-none relative pb-16">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#1A110B]/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in-95">
          <Sparkles size={14} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: MAIN RECHARGE AMOUNT SCREEN                                      */}
      {/* ========================================================================= */}
      {view === 'amount' && (
        <div className="w-full flex flex-col">
          {/* Top Bar / Header */}
          <header className="w-full bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
            <button
              onClick={() => setShowRecordsModal(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer active:scale-95"
            >
              Records
            </button>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">Recharge</h1>
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer active:scale-95"
            >
              Help
            </button>
          </header>

          <div className="p-4 space-y-4">
            {/* Balance Card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 text-center">
              <span className="text-xs text-gray-400 font-medium">Balance</span>
              <div className="mt-1 flex items-baseline justify-center">
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  ₹{formattedBalance}
                </span>
              </div>
            </div>

            {/* Amount Input Box */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-2xs border border-gray-100">
              <label className="text-xs text-gray-500 font-medium block mb-2">Amount</label>

              {/* Large Input Field */}
              <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2 focus-within:border-[#0088ff] transition-colors">
                <span className="text-2xl font-bold text-gray-900">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full text-2xl font-black text-gray-900 bg-transparent outline-hidden tracking-tight"
                />
                {amount && (
                  <button
                    onClick={() => setAmount('')}
                    className="text-gray-300 hover:text-gray-500 text-sm font-bold p-1 cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* 3x2 Quick Amount Preset Grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                {PRESET_AMOUNTS.map((val) => {
                  const isSelected = Number(amount) === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handlePresetClick(val)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 text-center ${
                        isSelected
                          ? 'bg-[#EBF5FF] text-[#0088ff] border border-[#0088ff] shadow-xs'
                          : 'bg-[#F5F7FA] hover:bg-[#EEF2F6] text-gray-700 border border-transparent'
                      }`}
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Big Vibrant Recharge Action Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full mt-5 py-3.5 bg-[#0088ff] hover:bg-[#0077ee] text-white text-base font-bold rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Recharge
              </button>

              {/* Trust & Safety Badges */}
              <div className="mt-4 flex items-center justify-center gap-6 text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <ShieldCheck size={16} className="text-gray-400" />
                  <span className="text-[11px] font-medium text-gray-500">Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={16} className="text-gray-400" />
                  <span className="text-[11px] font-medium text-gray-500">Fast</span>
                </div>
              </div>
            </div>

            {/* Live Success Ticker Notice */}
            <div className="w-full bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                ₹
              </div>
              <div className="text-xs text-gray-600 truncate">
                <span className="font-semibold text-gray-900">
                  {tickerItems[tickerIndex].user}
                </span>{' '}
                Successfully recharge{' '}
                <span className="text-emerald-600 font-bold">
                  ₹{tickerItems[tickerIndex].amount}
                </span>
              </div>
            </div>

            {/* Jannat Sponsor / Platform Guarantee Badge */}
            <div className="w-full pt-4 pb-2 flex flex-col items-center justify-center opacity-70">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#0088ff] flex items-center justify-center text-white text-[9px] font-black">
                  J
                </div>
                <span className="text-xs font-black tracking-wider text-gray-800 uppercase">
                  JANNAT VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">100% Secure & Encrypted Payments</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: PAYMENT METHOD SELECTION                                         */}
      {/* ========================================================================= */}
      {view === 'payment' && (
        <div className="w-full flex flex-col">
          {/* Header Bar */}
          <header className="w-full bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
            <button
              onClick={() => setView('amount')}
              className="w-7 h-7 -ml-2 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">Recharge</h1>
            <button
              onClick={() => setShowHelpModal(true)}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer active:scale-95"
            >
              Help
            </button>
          </header>

          {/* Top Blue Amount Banner */}
          <div className="w-full bg-[#0088ff] px-4 py-4 text-white">
            <span className="text-xs font-medium text-blue-100">Recharge Amount</span>
            <div className="text-3xl font-black tracking-tight mt-1 flex items-baseline">
              <span>₹ {Number(amount).toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Payment Category Tabs: UPI PAY vs QR Code */}
            <div className="w-full flex bg-gray-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setPaymentTab('upi')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentTab === 'upi'
                    ? 'bg-[#0088ff] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>UPI PAY</span>
              </button>
              <button
                onClick={() => setPaymentTab('qr')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paymentTab === 'qr'
                    ? 'bg-[#0088ff] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <QrCode size={14} />
                <span>QR code</span>
              </button>
            </div>

            {/* TAB CONTENT 1: UPI PAY (APP DIRECT) */}
            {paymentTab === 'upi' && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-600 tracking-tight block">
                  Select Payment Method
                </span>

                {/* Branded Payment Method List Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs divide-y divide-gray-100 overflow-hidden">
                  {/* Google Pay */}
                  <label
                    onClick={() => setPaymentMethod('gpay')}
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <GooglePayIcon />
                      <span className="text-sm font-semibold text-gray-800">G Pay</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'gpay'
                          ? 'border-[#0088ff] bg-[#0088ff]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'gpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </label>

                  {/* Paytm */}
                  <label
                    onClick={() => setPaymentMethod('paytm')}
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PaytmIcon />
                      <span className="text-sm font-semibold text-gray-800">paytm</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'paytm'
                          ? 'border-[#0088ff] bg-[#0088ff]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'paytm' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </label>

                  {/* PhonePe */}
                  <label
                    onClick={() => setPaymentMethod('phonepe')}
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PhonePeIcon />
                      <span className="text-sm font-semibold text-gray-800">PhonePe</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'phonepe'
                          ? 'border-[#0088ff] bg-[#0088ff]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'phonepe' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </label>

                  {/* Amazon Pay */}
                  <label
                    onClick={() => setPaymentMethod('amazonpay')}
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AmazonPayIcon />
                      <span className="text-sm font-semibold text-gray-800">amazon pay</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'amazonpay'
                          ? 'border-[#0088ff] bg-[#0088ff]'
                          : 'border-gray-300'
                      }`}
                    >
                      {paymentMethod === 'amazonpay' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: QR CODE */}
            {paymentTab === 'qr' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-gray-800">Scan & Pay ₹{amount}</span>
                <p className="text-[11px] text-gray-400 mt-0.5">Use any UPI app (GPay, PhonePe, Paytm)</p>

                {/* Simulated Stylized QR Code */}
                <div className="my-4 p-3 bg-white border-2 border-gray-200 rounded-2xl shadow-xs relative">
                  <div className="w-40 h-40 bg-[#FAF8F5] border border-gray-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Simulated QR Pattern Matrix */}
                    <div className="grid grid-cols-5 gap-1.5 p-3 opacity-80">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-xs ${
                            i % 2 === 0 || i % 5 === 0 ? 'bg-gray-900' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Center Brand Badge */}
                    <div className="absolute inset-0 m-auto w-10 h-10 bg-[#0088ff] rounded-lg border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
                      ₹
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-mono text-gray-700">
                  <span>jannat.recharge@upi</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('jannat.recharge@upi');
                      showToast('UPI ID copied to clipboard!');
                    }}
                    className="text-[#0088ff] hover:text-[#0066cc] cursor-pointer"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* Pay Action Button */}
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-3.5 bg-[#0088ff] hover:bg-[#0077ee] text-white text-base font-bold rounded-2xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <span>Pay ₹{Number(amount).toLocaleString()}</span>
              <ArrowRight size={16} />
            </button>

            {/* Tips Section (from reference screenshot) */}
            <div className="space-y-1.5 pt-2">
              <h3 className="text-xs font-bold text-gray-800">Tips</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Welcome to use the quick recharge mode, please use APP to complete the payment of ₹
                {amount}.
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                The transaction funds are guaranteed by the Jannat platform throughout the process,
                which is very safe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PAYMENT MODAL / SIMULATION CONFIRMATION POPUP                           */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#0088ff] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} />
                <span className="text-sm font-bold">UPI Payment Gateway</span>
              </div>
              <button
                onClick={closePaymentFlow}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {!paymentSuccess ? (
                <div className="space-y-4">
                  {/* Amount Pill */}
                  <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-blue-600 font-medium">Recharge Amount</span>
                      <p className="text-xl font-black text-blue-950">₹{amount}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0088ff] bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
                      {paymentTab === 'qr' ? 'QR Scan' : getMethodLabel(paymentMethod)}
                    </span>
                  </div>

                  {/* UPI Reference / UTR instructions */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 block">
                      12-Digit UTR / Ref Number (Optional for test)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 428901234567"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 outline-hidden focus:border-[#0088ff] font-mono"
                    />
                    <p className="text-[10px] text-gray-400">
                      Submit after completing payment in your UPI app for instant verification.
                    </p>
                  </div>

                  {/* Submit / Confirm Payment button */}
                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3 bg-[#0088ff] hover:bg-[#0077ee] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Confirm & Add ₹{amount}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Payment Success Celebration State */
                <div className="py-4 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-gray-900">Recharge Successful!</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{amount} has been added to your Jannat wallet balance.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-left text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-gray-500">
                      <span>Status:</span>
                      <span className="text-emerald-600 font-bold">COMPLETED</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Transaction ID:</span>
                      <span className="text-gray-800 font-bold">{lastTxId}</span>
                    </div>
                  </div>

                  <button
                    onClick={closePaymentFlow}
                    className="w-full py-2.5 bg-[#0088ff] hover:bg-[#0077ee] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Return to Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. RECORDS MODAL / TRANSACTION HISTORY                                    */}
      {/* ========================================================================= */}
      {showRecordsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-700" />
                <h2 className="text-sm font-bold text-gray-900">Recharge Records</h2>
              </div>
              <button
                onClick={() => setShowRecordsModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Records List */}
            <div className="p-4 overflow-y-auto divide-y divide-gray-100 space-y-2">
              {records.length > 0 ? (
                records.map((rec) => (
                  <div key={rec.id} className="pt-2.5 pb-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">₹{rec.amount}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.2 rounded">
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {rec.method} • {rec.date}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{rec.id}</span>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-400 text-xs">No recharge records found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HELP MODAL / RECHARGE GUIDE                                            */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-[#0088ff]" />
                <h2 className="text-sm font-bold text-gray-900">Recharge Help & FAQ</h2>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-gray-600">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">1. How to recharge?</h4>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Enter your amount, pick an instant preset, select your favorite UPI app (Google Pay,
                  Paytm, PhonePe, Amazon Pay) or scan the QR Code.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-1">2. When will the funds reflect?</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Recharges are automatically credited to your balance within 30-60 seconds.
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-1">3. Money debited but not added?</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Open Records, tap on your transaction, and input the 12-digit UTR reference number
                  from your bank SMS or payment app receipt.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowHelpModal(false);
                  showToast('Contacting 24/7 Telegram Support...');
                }}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Contact 24/7 Live Support</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recharge;