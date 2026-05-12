import { useState } from "react";
import Icon from "@/components/ui/icon";

const MANAGER = {
  name: "Александр Петров",
  position: "Руководитель отдела продаж",
  region: "Москва и МО",
  avatar: "АП",
};

const EMPLOYEES = [
  { id: 1, name: "Ирина Соколова", region: "Москва", calls: 142, deals: 23, revenue: 1_840_000, plan: 85, status: "ok", lastUpdate: "12.05.2026" },
  { id: 2, name: "Дмитрий Волков", region: "СПб", calls: 98, deals: 14, revenue: 1_120_000, plan: 62, status: "warn", lastUpdate: "11.05.2026" },
  { id: 3, name: "Мария Новикова", region: "Казань", calls: 167, deals: 31, revenue: 2_480_000, plan: 110, status: "ok", lastUpdate: "12.05.2026" },
  { id: 4, name: "Алексей Морозов", region: "Екб", calls: 54, deals: 6, revenue: 480_000, plan: 28, status: "danger", lastUpdate: "09.05.2026" },
  { id: 5, name: "Светлана Козлова", region: "Москва", calls: 121, deals: 19, revenue: 1_520_000, plan: 72, status: "warn", lastUpdate: "10.05.2026" },
  { id: 6, name: "Павел Лебедев", region: "Новосибирск", calls: 189, deals: 38, revenue: 3_040_000, plan: 132, status: "ok", lastUpdate: "12.05.2026" },
  { id: 7, name: "Анна Орлова", region: "СПб", calls: 76, deals: 9, revenue: 720_000, plan: 40, status: "danger", lastUpdate: "08.05.2026" },
];

const HISTORY = [
  { id: 1, employee: "Дмитрий Волков", field: "Звонки", old: "89", value: "98", user: "Волков Д.", date: "12.05.2026 14:32" },
  { id: 2, employee: "Ирина Соколова", field: "Сделки", old: "21", value: "23", user: "Соколова И.", date: "12.05.2026 11:15" },
  { id: 3, employee: "Мария Новикова", field: "Выручка", old: "2 240 000", value: "2 480 000", user: "Новикова М.", date: "11.05.2026 17:44" },
  { id: 4, employee: "Алексей Морозов", field: "Звонки", old: "67", value: "54", user: "Морозов А.", date: "09.05.2026 09:20" },
  { id: 5, employee: "Светлана Козлова", field: "Сделки", old: "22", value: "19", user: "Козлова С.", date: "10.05.2026 16:05" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "employees", label: "Сотрудники", icon: "Users" },
  { id: "history", label: "История", icon: "History" },
  { id: "reports", label: "Отчёты", icon: "FileBarChart2" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

const MISSING_STATS = [
  { name: "Алексей Морозов", field: "Отчёт за неделю", days: 3 },
  { name: "Анна Орлова", field: "Звонки за май", days: 4 },
];

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)} млн`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)} тыс`
    : String(n);

const statusColor: Record<string, string> = {
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
};
const statusLabel: Record<string, string> = {
  ok: "В норме",
  warn: "Внимание",
  danger: "Критично",
};

export default function Index() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filterRegion, setFilterRegion] = useState("Все");
  const [filterStatus, setFilterStatus] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(MISSING_STATS);
  const [sortCol, setSortCol] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [historyFilter, setHistoryFilter] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const filteredHistory = HISTORY.filter(
    (h) =>
      historyFilter === "" ||
      h.employee.toLowerCase().includes(historyFilter.toLowerCase()) ||
      h.field.toLowerCase().includes(historyFilter.toLowerCase())
  );

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="animate-notification-in bg-white border border-amber-200 rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 max-w-xs"
          >
            <div className="mt-0.5 bg-amber-100 rounded-lg p-1.5 shrink-0">
              <Icon name="AlertTriangle" size={14} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">{n.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{n.field} — не заполнено {n.days} дня</div>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((_, j) => j !== i))}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside
        className={`flex flex-col h-full bg-white border-r border-border transition-all duration-300 shrink-0 ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="p-4 border-b border-border">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-foreground text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
              {MANAGER.avatar}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{MANAGER.name}</div>
                <div className="text-xs text-muted-foreground truncate">{MANAGER.position}</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                activeNav === item.id
                  ? "bg-foreground text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon name={item.icon} size={16} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-border">
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <Icon name={sidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={15} />
            {!sidebarCollapsed && <span>Свернуть</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold">
              {NAV_ITEMS.find((n) => n.id === activeNav)?.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {MANAGER.region} · обновлено 12.05.2026
            </p>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Icon name="Bell" size={16} className="text-muted-foreground" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Dashboard & Employees */}
          {(activeNav === "dashboard" || activeNav === "employees") && (
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
                      {filtered.map((emp, i) => (
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
          )}

          {/* History */}
          {activeNav === "history" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-48">
                    <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Поиск по сотруднику или полю..."
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-lg border-0 outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="CalendarDays" size={14} />
                    <span>По дате</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Icon name="SlidersHorizontal" size={14} />
                    <span>Фильтры</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-medium">История изменений</span>
                  <span className="text-xs text-muted-foreground">{filteredHistory.length} записей</span>
                </div>
                <div className="divide-y divide-border">
                  {filteredHistory.map((h, i) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-4 hover:bg-secondary/20 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon name="FileEdit" size={14} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{h.employee}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{h.field}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground line-through">{h.old}</span>
                          <Icon name="ArrowRight" size={11} className="text-muted-foreground" />
                          <span className="text-xs font-semibold text-foreground">{h.value}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">{h.user}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{h.date}</div>
                      </div>
                    </div>
                  ))}
                  {filteredHistory.length === 0 && (
                    <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                      Ничего не найдено
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reports */}
          {activeNav === "reports" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: "Отчёт по звонкам", desc: "Детализация по сотрудникам за период", icon: "PhoneCall" },
                  { title: "Отчёт по сделкам", desc: "Воронка и конверсия по регионам", icon: "TrendingUp" },
                  { title: "Выполнение плана", desc: "KPI за текущий месяц в разрезе сотрудников", icon: "Target" },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-all cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-primary-foreground transition-colors">
                      <Icon name={r.icon} size={18} />
                    </div>
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.desc}</div>
                    <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      <Icon name="Download" size={12} />
                      <span>Скачать отчёт</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeNav === "settings" && (
            <div className="space-y-4 max-w-lg animate-fade-in">
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Профиль руководителя</h3>
                <div className="space-y-3">
                  {[
                    { label: "ФИО", value: MANAGER.name },
                    { label: "Должность", value: MANAGER.position },
                    { label: "Регион", value: MANAGER.region },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-muted-foreground block mb-1">{f.label}</label>
                      <input
                        defaultValue={f.value}
                        className="w-full px-3 py-2 text-sm bg-secondary rounded-lg border-0 outline-none focus:ring-1 focus:ring-foreground/20"
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-foreground text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity">
                  Сохранить
                </button>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold mb-4">Уведомления</h3>
                <div className="space-y-3">
                  {[
                    { label: "Незаполненная статистика", on: true },
                    { label: "Падение KPI ниже 50%", on: true },
                    { label: "Еженедельный отчёт", on: false },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between py-0.5">
                      <span className="text-sm">{n.label}</span>
                      <div className={`w-10 h-5.5 h-[22px] rounded-full relative cursor-pointer transition-colors ${n.on ? "bg-foreground" : "bg-secondary"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] shadow-sm transition-all ${n.on ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}