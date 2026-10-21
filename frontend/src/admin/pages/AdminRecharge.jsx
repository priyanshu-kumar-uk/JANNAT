import React, { useState } from 'react';
import AdminNav from '../components/AdminNav';
import {
  IndianRupee,
  Smartphone,
  Hash,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Sparkles,
} from 'lucide-react';

const AdminRecharge = () => {
  const [form, setForm] = useState({ amount: '', upiId: '', utr: '' });
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.amount || !form.upiId || !form.utr) {
      setStatus('error');
      setTimeout(() => setStatus(null), 2500);
      return;
    }

    const newRecord = {
      id: `REC-${Date.now().toString(36).toUpperCase()}`,
      amount: Number(form.amount),
      upiId: form.upiId,
      utr: form.utr,
      date: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setRecords([newRecord, ...records]);
    setForm({ amount: '', upiId: '', utr: '' });
    setStatus('success');
    setTimeout(() => setStatus(null), 2500);
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-white px-4 py-6">
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
            {/* Accent line */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-[2px] bg-blue-600 rounded-full" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-amount"
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <IndianRupee className="w-3 h-3" />
                  Amount
                </label>
                <div
                  className={`relative group rounded-xl border transition-all duration-300 ${
                    focusedField === 'amount'
                      ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    id="admin-amount"
                    value={form.amount}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('amount')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-black text-sm font-medium pl-8 pr-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* UPI ID Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-upiId"
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Smartphone className="w-3 h-3" />
                  UPI ID
                </label>
                <div
                  className={`relative group rounded-xl border transition-all duration-300 ${
                    focusedField === 'upiId'
                      ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="text"
                    name="upiId"
                    id="admin-upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('upiId')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="user@paytm"
                    className="w-full bg-transparent text-black text-sm font-medium px-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* UTR ID Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-utr"
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Hash className="w-3 h-3" />
                  UTR Number
                </label>
                <div
                  className={`relative group rounded-xl border transition-all duration-300 ${
                    focusedField === 'utr'
                      ? 'border-blue-500 shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="text"
                    name="utr"
                    id="admin-utr"
                    value={form.utr}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('utr')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter 12-digit UTR"
                    className="w-full bg-transparent text-black text-sm font-medium px-4 py-3 rounded-xl outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Status Message */}
              {status && (
                <div
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg animate-[fadeIn_0.3s_ease-out] ${
                    status === 'success'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Record added successfully!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      Please fill in all fields
                    </>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full relative group overflow-hidden rounded-xl bg-blue-600 py-3 text-sm font-bold text-white tracking-wide shadow-md hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.98] cursor-pointer transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Record
                </span>
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
            {records.length > 0 && (
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {records.length}
              </span>
            )}
          </div>

          {records.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                No records yet
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Added records will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="group rounded-xl border border-gray-200 bg-white p-3.5 transition-all duration-300 hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Amount & ID */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base font-bold text-black">
                          ₹{record.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {record.id}
                        </span>
                      </div>

                      {/* Details */}
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

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-[10px] text-gray-400">
                        {record.date}
                      </span>
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all duration-200 cursor-pointer"
                        aria-label="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRecharge;