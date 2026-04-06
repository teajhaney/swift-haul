const kpis = [
  { label: "Deliveries", value: "284", color: "text-green-400" },
  { label: "In Transit", value: "41", color: "text-blue-400" },
  { label: "Drivers", value: "18", color: "text-orange-400" },
];

const chartBars = [40, 65, 45, 80, 55, 90, 70];
const chartDays = ["M", "T", "W", "T", "F", "S", "S"];

const orders = [
  { id: "SH-4921", name: "Sarah Jenkins", status: "DELIVERED", color: "text-green-400 bg-green-400/10" },
  { id: "SH-4922", name: "Marcus Chen", status: "IN TRANSIT", color: "text-blue-400 bg-blue-400/10" },
  { id: "SH-4923", name: "Elena Rodriguez", status: "PENDING", color: "text-gray-400 bg-gray-400/10" },
];

export function DashboardMockup() {
  return (
    <div className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
      {/* Title bar */}
      <div className="bg-[#0a1e30] px-4 py-3 flex items-center gap-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-white/40 text-xs font-mono">Dashboard</span>
      </div>

      {/* Body */}
      <div className="bg-[#0d2035] p-4 space-y-3">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/5 rounded-lg p-2.5 border border-white/5"
            >
              <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-white/40 text-[10px] mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <p className="text-white/50 text-[10px] mb-2">Deliveries This Week</p>
          <div className="flex items-end gap-1 h-10">
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[#1A6FB5]/60"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {chartDays.map((d, i) => (
              <span key={i} className="text-white/30 text-[8px]">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Order rows */}
        <div className="space-y-1.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between bg-white/5 rounded-md px-3 py-2 border border-white/5"
            >
              <div>
                <p className="text-white/80 text-xs font-mono">{order.id}</p>
                <p className="text-white/40 text-[10px]">{order.name}</p>
              </div>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${order.color}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
