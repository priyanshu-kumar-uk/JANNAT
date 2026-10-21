import React from 'react';

/**
 * ResultPopup component matching the 3-color scheme:
 * - White for background
 * - Blue for clickable button (OK)
 * - Black for fonts
 */
const ResultPopup = ({
  isOpen = true,
  onClose,
  isWin = true,
  resultNumber = 3,
  period = '2204081728',
  price = '₹43,853',
  select = 'GREEN',
  point = 300,
  amount = 294.0,
}) => {
  if (!isOpen) return null;

  // Format amount display
  const formattedAmount =
    typeof amount === 'number'
      ? `${amount >= 0 ? '+' : '-'}₹${Math.abs(amount).toFixed(2)}`
      : amount;

  const formattedSelect = typeof select === 'string' ? select.toUpperCase() : String(select);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all select-none">
      <div className="relative w-full max-w-[320px] my-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="w-full py-4 px-4 flex flex-col items-center justify-center border-b border-gray-100 bg-white">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
            Round Outcome
          </span>
          <h2 className="text-2xl font-black text-black tracking-wide mt-0.5">
            {isWin ? 'VICTORY' : 'DEFEAT'}
          </h2>
        </div>

        {/* Number Badge */}
        <div className="w-full flex justify-center py-5 bg-white">
          <div className="w-18 h-18 rounded-full border-2 border-black flex items-center justify-center bg-white text-black font-extrabold text-3xl">
            {resultNumber}
          </div>
        </div>

        {/* Period & Price Rows */}
        <div className="w-full px-5 space-y-1.5 pb-2 text-black">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Period</span>
            <span className="font-semibold">{period}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Price</span>
            <span className="font-semibold">{price}</span>
          </div>
        </div>

        {/* Details Box */}
        <div className="mx-5 my-2 p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-black">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Select</span>
            <span className="font-bold">{formattedSelect}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Point</span>
            <span className="font-bold">{point}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Amount</span>
            <span className="font-black text-sm">{formattedAmount}</span>
          </div>
        </div>

        {/* OK Button */}
        <div className="p-5 pt-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-xl shadow-xs cursor-pointer text-center"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPopup;