import { FaUsers, FaFileAlt, FaChartLine, FaArrowUp } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
        <p className="text-slate-500 text-sm">Welcome back, John. Here's what's happening today.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,543"
          change="+12.5%"
          icon={<FaUsers />}
          color="blue"
        />
        <StatCard
          title="Documents"
          value="158"
          change="+3.4%"
          icon={<FaFileAlt />}
          color="indigo"
        />
        <StatCard
          title="Revenue"
          value="$45,200"
          change="+8.2%"
          icon={<FaChartLine />}
          color="emerald"
        />
        <StatCard
          title="Conversion"
          value="4.2%"
          change="-0.5%"
          icon={<FaArrowUp className="rotate-45" />}
          color="orange"
        />
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/50 text-slate-800 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 text-[15px] py-4">Entity</th>
                <th className="px-6 text-[15px] py-4">Status</th>
                <th className="px-6 text-[15px] py-4">Date</th>
                <th className="px-6 text-[15px] py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 uppercase">
              <TableRow name="Energypac Power" status="Completed" date="Jan 20, 2026" amount="$12,000.00" />
              <TableRow name="Solar Solutions" status="Pending" date="Jan 19, 2026" amount="$8,500.00" />
              <TableRow name="Grid Tech" status="Completed" date="Jan 18, 2026" amount="$3,200.00" />
              <TableRow name="Eco Energy" status="Cancelled" date="Jan 15, 2026" amount="$1,100.00" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {change}
        </span>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </div>
  );
}

function TableRow({ name, status, date, amount }) {
  const statusColors = {
    Completed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <span className="font-semibold text-slate-700 text-sm tracking-wide">{name}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-500 text-sm">{date}</td>
      <td className="px-6 py-4 text-right font-bold text-slate-800 text-sm">{amount}</td>
    </tr>
  );
}
