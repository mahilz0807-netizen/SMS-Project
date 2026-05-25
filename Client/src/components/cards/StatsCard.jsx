export default function StatsCard({ title, value, icon, trend, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
        {icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-lg shadow-lg`}>
            {icon}
          </div>
        )}
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </h2>

      {trend && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{trend}</p>
      )}
    </div>
  );
}