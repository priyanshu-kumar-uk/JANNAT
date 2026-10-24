import React from 'react';
import AdminNav from '../components/AdminNav';
import {
  IndianRupee,
  Smartphone,
  Hash,
  Plus,
  Clock,
  Trash2,
} from 'lucide-react';

const mockRecords = [
  {
    id: 'REC-99812401',
    amount: 500,
    upiId: 'player99@okhdfcbank',
    utr: '428190349182',
    date: 'Today, 04:15 PM',
  },
  {
    id: 'REC-99812398',
    amount: 1000,
    upiId: 'vip_user@paytm',
    utr: '428190311209',
    date: 'Today, 03:50 PM',
  },
];

const AdminRecharge = () => {
  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white px-4 py-6 font-sans">
        {/* Page Header */}
        <div className="max-w-lg mx-auto mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">
                Recharge Manager
              </h1>
              <p className="text-xs text-gray-400">
                Add and manage recharge records
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-[2px] bg-blue-600 rounded-full" />

            <form className="space-y-4">
              {/* Amount Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3 h-3" />
                  Amount
                </label>
                <div className="relative rounded-xl border border-gray-200 hover:border-gray-300">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    className="w-full bg-transparent text-black text-sm font-medium pl-8 pr-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* UPI ID Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3" />
                  UPI ID
                </label>
                <div className="relative rounded-xl border border-gray-200 hover:border-gray-300">
                  <input
                    type="text"
                    name="upiId"
                    placeholder="user@paytm"
                    className="w-full bg-transparent text-black text-sm font-medium px-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* UTR ID Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  UTR Number
                </label>
                <div className="relative rounded-xl border border-gray-200 hover:border-gray-300">
                  <input
                    type="text"
                    name="utr"
                    placeholder="Enter 12-digit UTR"
                    className="w-full bg-transparent text-black text-sm font-medium px-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full overflow-hidden rounded-xl bg-blue-600 py-3 text-sm font-bold text-white tracking-wide shadow-md hover:bg-blue-700 active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>
            </form>
          </div>
        </div>

        {/* Records Section */}
        <div className="max-w-lg mx-auto mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Recent Records
            </h2>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {mockRecords.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {mockRecords.map((record) => (
              <div
                key={record.id}
                className="group rounded-xl border border-gray-200 bg-white p-3.5 transition-all hover:border-blue-300 hover:shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base font-bold text-black">
                        ₹{record.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {record.id}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-500 truncate">
                        <span className="text-gray-400">UPI:</span>{' '}
                        <span className="text-black">{record.upiId}</span>
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        <span className="text-gray-400">UTR:</span>{' '}
                        <span className="text-black font-mono">
                          {record.utr}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-[10px] text-gray-400">
                      {record.date}
                    </span>
                    <button
                      type="button"
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all cursor-pointer"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRecharge;