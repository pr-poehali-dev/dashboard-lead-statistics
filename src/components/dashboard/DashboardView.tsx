import { useState } from "react";
import Icon from "@/components/ui/icon";
import { EMPLOYEES, fmt, statusColor, statusLabel } from "./data";

interface DashboardViewProps {
  activeNav: string;
}

export default function DashboardView({ activeNav }: DashboardViewProps) {
  const [filterRegion, setFilterRegion] = useState("Все");
  const [filterStatus, setFilterStatus] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const regions = ["Все", ...Array.from(new Set(EMPLOYEES.map((e) => e.region)))];

  const filtered = EMPLOYEES.filter((e) => {
    const regionOk = filterRegion === "Все" || e.region === filterRegion;
    const statusOk = filterStatus === "Все" || e.status === filterStatus;
    const searchOk = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    return regionOk && statusOk && searchOk;
  }).sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortCol === "name") return a.name.localeCompare(b.name) * dir;
    if (sortCol === "calls") return (a.calls - b.calls) * dir;
    if (sortCol === "deals") return (a.deals - b.deals) * dir;
    if (sortCol === "revenue") return (a.revenue - b.revenue) * dir;
    if (sortCol === "plan") return (a.plan - b.plan) * dir;
    return 0;
  });

  const totalRevenue = EMPLOYEES.reduce((s, e) => s + e.revenue, 0);
  const avgPlan = Math.round(EMPLOYEES.reduce((s, e) => s + e.plan, 0) / EMPLOYEES.length);
  const totalDeals = EMPLOYEES.reduce((s, e) => s + e.deals, 0);
  const atRisk = EMPLOYEES.filter((e) => e.status === "danger").length;

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: string }) =>
    sortCol === col ? (
      <Icon name={sortDir === "asc" ? "ChevronUp" : "ChevronDown"} size={12} />
    ) : (
      <Icon name="ChevronsUpDown" size={12} className="opacity-30" />
    );

  return (
    <>
      {activeNav === "dashboard" && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Общая выручка", value: fmt(totalRevenue) + " ₽", icon: "TrendingUp", trend: "+8% к прошлому месяцу", trendColor: "text-emerald-600" },
            { label: "Выполнение плана", value: `${avgPlan}%`, icon: "Target", trend: avgPlan >= 80 ? "Хороший темп" : "Отстаём от плана", trendColor: avgPlan >= 80 ? "text-emerald-600" : "text-red-500" },
            { label: "Всего сделок", value: String(totalDeals), icon: "Handshake", trend: "+3 за сегодня", trendColor: "text-blue-600" },
            { label: "Под риском", value: `${atRisk} чел.`, icon: "AlertCircle", trend: atRisk > 0 ? "Требует внимания" : "Всё в порядке", trendColor: atRisk > 0 ? "text-red-500" : "text-emerald-600" },
          ].map((w, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{w.label}</span>
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon name={w.icon} size={14} />
                </div>
              </div>
              <div className="text-2xl font-semibold">{w.value}</div>
              <div className={`text-xs mt-1.5 ${w.trendColor}`}>{w.trend}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по сотруднику..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-lg border-0 outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Регион:</span>
            <div className="flex gap-1 flex-wrap">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    filterRegion === r
                      ? "bg-foreground text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Статус:</span>
            <div className="flex gap-1">
              {(["Все", "ok", "warn", "danger"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    filterStatus === s
                      ? "bg-foreground text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s === "Все" ? "Все" : statusLabel[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium">Сотрудники</span>
          <span className="text-xs text-muted-foreground">{filtered.length} из {EMPLOYEES.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {[
                  { key: "name", label: "Сотрудник" },
                  { key: "region", label: "Регион" },
                  { key: "calls", label: "Звонки" },
                  { key: "deals", label: "Сделки" },
                  { key: "revenue", label: "Выручка" },
                  { key: "plan", label: "% плана" },
                  { key: "status", label: "Статус" },
                  { key: "lastUpdate", label: "Обновлено" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium shrink-0">
                        {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium whitespace-nowrap">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{emp.region}</td>
                  <td className="px-4 py-3 tabular-nums">{emp.calls}</td>
                  <td className="px-4 py-3 tabular-nums">{emp.deals}</td>
                  <td className="px-4 py-3 tabular-nums whitespace-nowrap">{fmt(emp.revenue)} ₽</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-20">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            emp.plan >= 100 ? "bg-emerald-500" : emp.plan >= 60 ? "bg-amber-400" : "bg-red-400"
                          }`}
                          style={{ width: `${Math.min(emp.plan, 100)}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-xs whitespace-nowrap">{emp.plan}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border whitespace-nowrap ${statusColor[emp.status]}`}>
                      {statusLabel[emp.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{emp.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
