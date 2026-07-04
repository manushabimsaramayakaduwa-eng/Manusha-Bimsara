import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Receipt
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  receiptUrl?: string;
}

interface MoneyBookProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  scouts: any[];
  onAuditLog: (action: string) => void;
  onStorageChange?: (mbDelta: number) => void;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    category: 'Membership Dues',
    description: 'Q2 2026 Troop Dues Collection',
    amount: 12500,
    date: '2026-05-15',
    reference: 'Troop Scribe',
    receiptUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tx-2',
    type: 'expense',
    category: 'Camp Equipment',
    description: '4x Waterproof Pioneering Tents',
    amount: 18000,
    date: '2026-05-20',
    reference: '51st Colombo Quartermaster',
    receiptUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tx-3',
    type: 'income',
    category: 'Donations',
    description: 'Old Boys Association annual sponsorship',
    amount: 45000,
    date: '2026-06-01',
    reference: 'CIS Alumni Association',
    receiptUrl: ''
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'Catering & Rations',
    description: 'Campout meals and dry ingredients',
    amount: 8500,
    date: '2026-06-10',
    reference: 'Keells Super',
    receiptUrl: ''
  },
  {
    id: 'tx-5',
    type: 'expense',
    category: 'Badges & Printing',
    description: 'Purchase of 50x President Scout merit badges',
    amount: 6200,
    date: '2026-06-25',
    reference: 'Sri Lanka Scout HQ',
    receiptUrl: ''
  }
];

export default function MoneyBook({ currentUser, scouts, onAuditLog, onStorageChange }: MoneyBookProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Modal Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCategory, setTxCategory] = useState('Membership Dues');
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txRef, setTxRef] = useState('');
  const [txReceiptUrl, setTxReceiptUrl] = useState('');

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('51_scouttrack_transactions', JSON.stringify(transactions));
    
    // Calculate and trigger storage size estimation for receipt images
    if (onStorageChange) {
      let totalMB = 0;
      transactions.forEach(t => {
        if (t.receiptUrl) {
          totalMB += 1.8; // Assume 1.8MB per receipt photo
        }
      });
      onStorageChange(totalMB);
    }
  }, [transactions, onStorageChange]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDesc.trim() || !txAmount || Number(txAmount) <= 0) return;

    const amountNum = Number(txAmount);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      category: txCategory,
      description: txDesc.trim(),
      amount: amountNum,
      date: txDate,
      reference: txRef.trim() || 'Troop Treasury Office',
      receiptUrl: txReceiptUrl.trim() || undefined
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAddOpen(false);

    // Dynamic alerts based on user requirement: "11. If admin / Leader changes enything in website inform it to Admins Email or whatsapp"
    const isLarge = amountNum >= 10000;
    const warningPrefix = isLarge ? '[CRITICAL LEDGER WARNING] ' : '[FINANCIAL REGISTRY] ';
    const alertMsg = `${warningPrefix}Leader (${currentUser.fullName}) recorded new ${txType.toUpperCase()} of LKR ${amountNum} under Category "${txCategory}". Details: "${newTx.description}".`;
    onAuditLog(alertMsg);

    // Trigger Success feedback
    setSuccessMsg(`Transaction successfully booked! Live alerts routed.`);
    setTimeout(() => setSuccessMsg(''), 4500);

    // Reset Form
    setTxDesc('');
    setTxAmount('');
    setTxRef('');
    setTxReceiptUrl('');
  };

  const handleDeleteTransaction = (id: string, description: string, amount: number, type: 'income' | 'expense') => {
    if (!confirm(`Are you sure you want to permanently delete transaction "${description}" (LKR ${amount})?`)) return;

    setTransactions(prev => prev.filter(t => t.id !== id));
    
    const alertMsg = `[LEDGER TAMPER AUDIT] - Leader (${currentUser.fullName}) voided/deleted transaction: "${description}" of LKR ${amount} (${type}).`;
    onAuditLog(alertMsg);
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Dues summary from Scouts list
  const pendingDuesScouts = scouts.filter(s => s.duesStatus === 'Pending' || s.duesStatus === 'Overdue');
  const totalUnpaidDues = pendingDuesScouts.reduce((sum, s) => sum + (s.duesAmount || 0), 0);

  // Filtered transactions list
  const filteredTxs = transactions.filter(t => {
    const typeMatch = filterType === 'all' || t.type === filterType;
    const catMatch = filterCategory === 'all' || t.category === filterCategory;
    return typeMatch && catMatch;
  });

  // Categories list
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  // Recharts monthly breakdown preparation
  const getChartData = () => {
    // Sort transactions chronologically
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    const monthlyMap: { [month: string]: { income: number; expense: number; balance: number } } = {};
    
    let rollingBalance = 0;

    sorted.forEach(t => {
      const monthLabel = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyMap[monthLabel]) {
        monthlyMap[monthLabel] = { income: 0, expense: 0, balance: 0 };
      }
      if (t.type === 'income') {
        monthlyMap[monthLabel].income += t.amount;
        rollingBalance += t.amount;
      } else {
        monthlyMap[monthLabel].expense += t.amount;
        rollingBalance -= t.amount;
      }
      monthlyMap[monthLabel].balance = rollingBalance;
    });

    return Object.keys(monthlyMap).map(m => {
      // Human-readable month: "2026-05" -> "May 2026"
      const dateParts = m.split('-');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedMonth = dateParts[1] ? `${monthNames[parseInt(dateParts[1]) - 1]} ${dateParts[0]}` : m;
      return {
        month: formattedMonth,
        Income: monthlyMap[m].income,
        Expense: monthlyMap[m].expense,
        Balance: monthlyMap[m].balance
      };
    });
  };

  const chartData = getChartData();
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-gold" />
            <span>⚜️ Troop Financials & Money Book</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital ledger for tracking the 51st Colombo treasury. Record scout dues, external donations, and logistics camp expenditures.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        )}
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border-l-4 border-brand-green p-4 rounded-r-lg flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-brand-green" />
          <span className="text-xs text-slate-700 font-medium">{successMsg}</span>
        </div>
      )}

      {/* Bento Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Treasury Net Balance */}
        <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Treasury Net Balance</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-brand-green">
              ⚜️
            </span>
          </div>
          <div className="mt-4">
            <h4 className={`text-2xl font-black ${netBalance >= 0 ? 'text-brand-green' : 'text-rose-600'}`}>
              LKR {netBalance.toLocaleString()}
            </h4>
            <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              Net Assets available in cash box
            </p>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Income Receipts</span>
            <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-brand-green">
              <TrendingUp className="w-4 h-4 text-brand-green" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-brand-green">
              LKR {totalIncome.toLocaleString()}
            </h4>
            <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              Including dues and alumni fundings
            </p>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Expenditures</span>
            <span className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-rose-600">
              LKR {totalExpense.toLocaleString()}
            </h4>
            <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              Equipment, catering, and badge syllabus
            </p>
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding Troop Dues</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-amber-600">
              LKR {totalUnpaidDues.toLocaleString()}
            </h4>
            <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              From {pendingDuesScouts.length} scouts currently pending/overdue
            </p>
          </div>
        </div>

      </div>

      {/* Visual Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h4 className="font-sans font-black text-sm text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-brand-gold" />
            <span>Monthly Treasury Trendlines</span>
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3E29" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1E3E29" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(val) => `LKR ${val}`} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="Balance" stroke="#1E3E29" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters and List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Filters Top bar */}
        <div className="bg-slate-50/50 border-b border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-brand-green" />
            <span>Ledger Transaction Log</span>
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 font-semibold focus:outline-none focus:border-brand-green cursor-pointer"
              >
                <option value="all">All Entries</option>
                <option value="income">Incomes 🟢</option>
                <option value="expense">Expenses 🔴</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-slate-700 font-semibold focus:outline-none focus:border-brand-green cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black tracking-widest bg-slate-50/30">
                <th className="p-4">Type</th>
                <th className="p-4">Details / Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Account Reference</th>
                <th className="p-4 text-right">Amount (LKR)</th>
                <th className="p-4 text-center">Receipt</th>
                {canEdit && <th className="p-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTxs.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/40 transition">
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.type === 'income' 
                        ? 'bg-emerald-50 text-brand-green' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {t.type}
                    </span>
                  </td>

                  <td className="p-4">
                    <div>
                      <span className="text-slate-800 font-semibold block text-[13px]">{t.description}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-bold uppercase tracking-wider">{t.category}</span>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {t.date}
                  </td>

                  <td className="p-4 text-slate-600 font-sans">
                    {t.reference}
                  </td>

                  <td className={`p-4 text-right font-mono font-black text-sm whitespace-nowrap ${
                    t.type === 'income' ? 'text-brand-green' : 'text-slate-700'
                  }`}>
                    {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {t.receiptUrl ? (
                      <a 
                        href={t.receiptUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-brand-green hover:text-brand-green-light font-bold"
                      >
                        <Receipt className="w-4 h-4 text-brand-gold" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No receipt</span>
                    )}
                  </td>

                  {canEdit && (
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(t.id, t.description, t.amount, t.type)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Void Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {filteredTxs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic font-light">
                    No transactions registered matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Recording Transaction */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4 text-slate-800">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">
              Book Money Transaction
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              
              {/* Type Switch */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction Type*</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('income');
                      setTxCategory('Membership Dues');
                    }}
                    className={`py-2 rounded-lg font-black uppercase text-[10px] transition cursor-pointer ${
                      txType === 'income' ? 'bg-brand-green text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Income Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('expense');
                      setTxCategory('Camp Equipment');
                    }}
                    className={`py-2 rounded-lg font-black uppercase text-[10px] transition cursor-pointer ${
                      txType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Log Expenditure
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction Category*</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer font-bold"
                >
                  {txType === 'income' ? (
                    <>
                      <option value="Membership Dues">Membership Dues Collection</option>
                      <option value="Donations">Sponsorship & Donations</option>
                      <option value="Event Fees">Camporee / Event Fees</option>
                      <option value="Investments">Investments / Other receipts</option>
                    </>
                  ) : (
                    <>
                      <option value="Camp Equipment">Campout Gear & Logistics</option>
                      <option value="Catering & Rations">Catering & Meals</option>
                      <option value="Transportation">Transportation & Petrol</option>
                      <option value="Badges & Printing">Proficiency Badges & Syllabus</option>
                      <option value="First Aid Gear">Medical & Safety Kit Refill</option>
                      <option value="Office & Printing">Admin Stationery</option>
                    </>
                  )}
                </select>
              </div>

              {/* Amount and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amount (LKR)*</label>
                  <input
                    type="number"
                    required
                    placeholder="LKR amount"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction Date*</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brief Narration / Description*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchased rope & bamboo poles"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Reference */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payer / Payee Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Scribe Office, Ceylon Camping store"
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Receipt URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Voucher Photo URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/... or keep empty"
                  value={txReceiptUrl}
                  onChange={(e) => setTxReceiptUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light shadow-xs"
                >
                  Commit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
