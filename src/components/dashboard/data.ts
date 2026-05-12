export const MANAGER = {
  name: "Александр Петров",
  position: "Руководитель отдела продаж",
  region: "Москва и МО",
  avatar: "АП",
};

export const EMPLOYEES = [
  { id: 1, name: "Ирина Соколова", region: "Москва", calls: 142, deals: 23, revenue: 1_840_000, plan: 85, status: "ok", lastUpdate: "12.05.2026" },
  { id: 2, name: "Дмитрий Волков", region: "СПб", calls: 98, deals: 14, revenue: 1_120_000, plan: 62, status: "warn", lastUpdate: "11.05.2026" },
  { id: 3, name: "Мария Новикова", region: "Казань", calls: 167, deals: 31, revenue: 2_480_000, plan: 110, status: "ok", lastUpdate: "12.05.2026" },
  { id: 4, name: "Алексей Морозов", region: "Екб", calls: 54, deals: 6, revenue: 480_000, plan: 28, status: "danger", lastUpdate: "09.05.2026" },
  { id: 5, name: "Светлана Козлова", region: "Москва", calls: 121, deals: 19, revenue: 1_520_000, plan: 72, status: "warn", lastUpdate: "10.05.2026" },
  { id: 6, name: "Павел Лебедев", region: "Новосибирск", calls: 189, deals: 38, revenue: 3_040_000, plan: 132, status: "ok", lastUpdate: "12.05.2026" },
  { id: 7, name: "Анна Орлова", region: "СПб", calls: 76, deals: 9, revenue: 720_000, plan: 40, status: "danger", lastUpdate: "08.05.2026" },
];

export const HISTORY = [
  { id: 1, employee: "Дмитрий Волков", field: "Звонки", old: "89", value: "98", user: "Волков Д.", date: "12.05.2026 14:32" },
  { id: 2, employee: "Ирина Соколова", field: "Сделки", old: "21", value: "23", user: "Соколова И.", date: "12.05.2026 11:15" },
  { id: 3, employee: "Мария Новикова", field: "Выручка", old: "2 240 000", value: "2 480 000", user: "Новикова М.", date: "11.05.2026 17:44" },
  { id: 4, employee: "Алексей Морозов", field: "Звонки", old: "67", value: "54", user: "Морозов А.", date: "09.05.2026 09:20" },
  { id: 5, employee: "Светлана Козлова", field: "Сделки", old: "22", value: "19", user: "Козлова С.", date: "10.05.2026 16:05" },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "employees", label: "Сотрудники", icon: "Users" },
  { id: "history", label: "История", icon: "History" },
  { id: "reports", label: "Отчёты", icon: "FileBarChart2" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export const MISSING_STATS = [
  { name: "Алексей Морозов", field: "Отчёт за неделю", days: 3 },
  { name: "Анна Орлова", field: "Звонки за май", days: 4 },
];

export const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)} млн`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(0)} тыс`
    : String(n);

export const statusColor: Record<string, string> = {
  ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
};

export const statusLabel: Record<string, string> = {
  ok: "В норме",
  warn: "Внимание",
  danger: "Критично",
};

export type Employee = typeof EMPLOYEES[number];
export type HistoryEntry = typeof HISTORY[number];
export type MissingStat = typeof MISSING_STATS[number];
