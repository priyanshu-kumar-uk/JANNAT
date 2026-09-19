import React from 'react';

/**
 * ResultPopup component matching the game winning/result modal dialog.
 * 
 * Props:
 * - isOpen: boolean (whether popup is visible, defaults to true)
 * - onClose: function (callback when OK or backdrop is clicked)
 * - isWin: boolean (whether user won or lost, defaults to true)
 * - resultNumber: number (0-9, defaults to 3)
 * - period: string | number (defaults to '2204081728')
 * - price: string | number (defaults to '$43853')
 * - select: string (e.g. 'GREEN', 'RED', 'VIOLET', or number, defaults to 'GREEN')
 * - point: number | string (defaults to 300)
 * - amount: number | string (defaults to 294 or '+₹294.00')
 */
const ResultPopup = ({
  isOpen = true,
  onClose,
  isWin = true,
  resultNumber = 3,
  period = '2204081728',
  price = '$43853',
  select = 'GREEN',
  point = 300,
  amount = 294.0,
}) => {
  if (!isOpen) return null;

  // Determine badge background based on result number
  const getBadgeStyle = (num) => {
    if (num === 0) {
      return {
        background: 'linear-gradient(90deg, #fa3c1e 50%, #6855f4 50%)',
      };
    }
    if (num === 5) {
      return {
        background: 'linear-gradient(90deg, #00c07f 50%, #6855f4 50%)',
      };
    }
    if ([1, 3, 7, 9].includes(num)) {
      return { background: '#00c07f' };
    }
    return { background: '#fa3c1e' };
  };

  // Format amount display
  const formattedAmount = typeof amount === 'number'
    ? `${amount >= 0 ? '+' : '-'}₹${Math.abs(amount).toFixed(2)}`
    : amount;

  // Format select string
  const formattedSelect = typeof select === 'string' ? select.toUpperCase() : String(select);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 transition-all select-none">
      {/* Container for the popup dialog and its floating decorations */}
      <div className="relative w-full max-w-[330px] my-auto">
        
        {/* ================= TOP FLOATING DECORATIONS ================= */}

        {/* Floating Sparkle Star Left */}
        <div className="absolute -top-15 left-5 z-30 pointer-events-none">
          <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,215,0,0.85)]">
            <defs>
              <radialGradient id="starGlowL" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="40%" stopColor="#FFEE58" />
                <stop offset="100%" stopColor="#FFB300" />
              </radialGradient>
            </defs>
            <path
              d="M20 0 C20 10 25 15 35 20 C25 25 20 30 20 40 C20 30 15 25 5 20 C15 15 20 10 20 0 Z"
              fill="url(#starGlowL)"
            />
            {/* Center sparkle core */}
            <circle cx="20" cy="20" r="3.5" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>

        {/* Floating Sparkle Star Right */}
        <div className="absolute -top-12 right-9 z-30 pointer-events-none">
          <svg viewBox="0 0 40 40" className="w-7 h-7 drop-shadow-[0_0_10px_rgba(255,215,0,0.85)]">
            <defs>
              <radialGradient id="starGlowR" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="40%" stopColor="#FFEE58" />
                <stop offset="100%" stopColor="#FFB300" />
              </radialGradient>
            </defs>
            <path
              d="M20 0 C20 10 25 15 35 20 C25 25 20 30 20 40 C20 30 15 25 5 20 C15 15 20 10 20 0 Z"
              fill="url(#starGlowR)"
            />
            <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>

        {/* Golden Crown on Top Center */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <svg viewBox="0 0 120 80" className="w-26 h-18 drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]">
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="25%" stopColor="#FFD54F" />
                <stop offset="65%" stopColor="#FFA000" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
              <linearGradient id="crownRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF8F00" />
                <stop offset="50%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FF8F00" />
              </linearGradient>
              <linearGradient id="goldPearl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FFF176" />
                <stop offset="100%" stopColor="#FFA000" />
              </linearGradient>
            </defs>

            {/* Crown Main Body with 5 peaks */}
            <path
              d="M 16 62 L 10 28 L 38 45 L 60 14 L 82 45 L 110 28 L 104 62 Z"
              fill="url(#crownGrad)"
              stroke="#FF8F00"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Inner Sheen / Depth Highlights */}
            <path
              d="M 60 18 L 74 44 L 60 58 L 46 44 Z"
              fill="#FFFFFF"
              opacity="0.3"
            />

            {/* Curved Base Rim */}
            <path
              d="M 14 59 C 40 67 80 67 106 59 L 104 68 C 80 76 40 76 16 68 Z"
              fill="url(#crownRimGrad)"
              stroke="#FF6F00"
              strokeWidth="1"
            />

            {/* Base Rim Pearls */}
            <circle cx="35" cy="65" r="3" fill="url(#goldPearl)" />
            <circle cx="60" cy="67" r="3.8" fill="url(#goldPearl)" />
            <circle cx="85" cy="65" r="3" fill="url(#goldPearl)" />

            {/* Top Pearls on 5 Peak Tips */}
            <circle cx="10" cy="27" r="5" fill="url(#goldPearl)" stroke="#FFA000" strokeWidth="0.8" />
            <circle cx="38" cy="44" r="4.5" fill="url(#goldPearl)" stroke="#FFA000" strokeWidth="0.8" />
            <circle cx="60" cy="13" r="6.5" fill="url(#goldPearl)" stroke="#FFA000" strokeWidth="1" />
            <circle cx="82" cy="44" r="4.5" fill="url(#goldPearl)" stroke="#FFA000" strokeWidth="0.8" />
            <circle cx="110" cy="27" r="5" fill="url(#goldPearl)" stroke="#FFA000" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Floating Rupee Coin Left */}
        <div className="absolute -left-5 top-1 z-30 pointer-events-none transform -rotate-12 drop-shadow-lg">
          <svg viewBox="0 0 54 54" className="w-13 h-13">
            <defs>
              <radialGradient id="coinGradL" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="40%" stopColor="#FFCA28" />
                <stop offset="85%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#F57C00" />
              </radialGradient>
              <linearGradient id="coinRimL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>
            {/* Outer Coin Disc */}
            <circle cx="27" cy="27" r="25" fill="url(#coinGradL)" stroke="url(#coinRimL)" strokeWidth="1.8" />
            {/* Inner Embossed Ring */}
            <circle cx="27" cy="27" r="20" fill="none" stroke="#FFE082" strokeWidth="1.5" opacity="0.9" />
            {/* Rupee Symbol 3D Shadow & Main */}
            <text
              x="27"
              y="34.5"
              fontSize="24"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              fill="#BF360C"
              opacity="0.4"
            >
              ₹
            </text>
            <text
              x="27"
              y="33.5"
              fontSize="24"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              fill="#FF8F00"
            >
              ₹
            </text>
          </svg>
        </div>

        {/* Floating Rupee Coin Right */}
        <div className="absolute -right-3 -top-2 z-30 pointer-events-none transform rotate-12 drop-shadow-lg">
          <svg viewBox="0 0 54 54" className="w-13 h-13">
            <defs>
              <radialGradient id="coinGradR" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="40%" stopColor="#FFCA28" />
                <stop offset="85%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#F57C00" />
              </radialGradient>
              <linearGradient id="coinRimR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>
            {/* Outer Coin Disc */}
            <circle cx="27" cy="27" r="25" fill="url(#coinGradR)" stroke="url(#coinRimR)" strokeWidth="1.8" />
            {/* Inner Embossed Ring */}
            <circle cx="27" cy="27" r="20" fill="none" stroke="#FFE082" strokeWidth="1.5" opacity="0.9" />
            {/* Rupee Symbol */}
            <text
              x="27"
              y="34.5"
              fontSize="24"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              fill="#BF360C"
              opacity="0.4"
            >
              ₹
            </text>
            <text
              x="27"
              y="33.5"
              fontSize="24"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              fill="#FF8F00"
            >
              ₹
            </text>
          </svg>
        </div>

        {/* ================= MAIN WHITE MODAL CARD ================= */}
        <div className="bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative z-20">
          
          {/* Header Banner ("WIN" / "LOSE") */}
          <div
            className={`w-full pt-5 pb-3.5 px-4 flex items-center justify-center relative overflow-hidden ${
              isWin
                ? 'bg-gradient-to-r from-[#ff823d] via-[#ff6133] to-[#ff4a3d]'
                : 'bg-gradient-to-r from-[#64748b] to-[#475569]'
            }`}
          >
            {/* Translucent Diagonal Sheen Reflection */}
            <div className="absolute -top-8 -bottom-8 left-[28%] w-10 bg-white/20 transform -skew-x-25 pointer-events-none" />
            <div className="absolute -top-8 -bottom-8 left-[38%] w-3 bg-white/15 transform -skew-x-25 pointer-events-none" />

            {/* Banner Content */}
            <div className="flex items-center gap-3 relative z-10">
              {/* Left Yellow Ray Accents */}
              {isWin && (
                <div className="flex flex-col items-end gap-1.5 opacity-90">
                  <span className="w-2.5 h-[2.5px] bg-[#FFE082] rounded-full rotate-45 transform origin-right" />
                  <span className="w-3 h-[2.5px] bg-[#FFE082] rounded-full" />
                </div>
              )}

              {/* Title Text */}
              <h2 className="text-3xl font-black text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)] font-sans">
                {isWin ? 'WIN' : 'LOSE'}
              </h2>

              {/* Right Yellow Ray Accents */}
              {isWin && (
                <div className="flex flex-col items-start gap-1.5 opacity-90">
                  <span className="w-2.5 h-[2.5px] bg-[#FFE082] rounded-full -rotate-45 transform origin-left" />
                  <span className="w-3 h-[2.5px] bg-[#FFE082] rounded-full" />
                </div>
              )}
            </div>
          </div>

          {/* Winning Number Circle */}
          <div className="w-full flex justify-center pt-6 pb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-md text-white font-extrabold text-[42px] leading-none"
              style={getBadgeStyle(Number(resultNumber))}
            >
              {resultNumber}
            </div>
          </div>

          {/* Period & Price Rows */}
          <div className="w-full px-6 space-y-2 pb-2">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#64748b] font-normal">Period</span>
              <span className="text-[#1e293b] font-medium tracking-tight">{period}</span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#64748b] font-normal">Price</span>
              <span className="text-[#1e293b] font-medium tracking-tight">{price}</span>
            </div>
          </div>

          {/* Inner Details Container (Soft lavender/blue-gray) */}
          <div className="mx-6 my-2 p-3.5 rounded-xl bg-[#f5f6fc] border border-[#eaedf8] space-y-2.5">
            {/* Select */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#64748b] font-normal">Select</span>
              <span className="text-[#1e293b] font-bold tracking-wide">{formattedSelect}</span>
            </div>

            {/* Point */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#64748b] font-normal">Point</span>
              <span className="text-[#1e293b] font-bold">{point}</span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#64748b] font-normal">Amount</span>
              <span
                className={`font-black tracking-tight text-[19px] ${
                  isWin ? 'text-[#00c08b]' : 'text-red-500'
                }`}
              >
                {formattedAmount}
              </span>
            </div>
          </div>

          {/* OK Button */}
          <div className="px-6 pt-3 pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#0080ff] hover:bg-[#0073e6] active:scale-[0.98] transition-all text-white font-bold text-[15px] rounded-xl shadow-md shadow-blue-500/25 cursor-pointer text-center tracking-wide"
            >
              OK
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultPopup;