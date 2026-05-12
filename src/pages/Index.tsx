import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MANAGER, NAV_ITEMS, MISSING_STATS, MissingStat } from "@/components/dashboard/data";
import Sidebar from "@/components/dashboard/Sidebar";
import NotificationStack from "@/components/dashboard/NotificationStack";
import DashboardView from "@/components/dashboard/DashboardView";
import HistoryView from "@/components/dashboard/HistoryView";

export default function Index() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [notifications, setNotifications] = useState<MissingStat[]>(MISSING_STATS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <NotificationStack notifications={notifications} setNotifications={setNotifications} />

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

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

          {(activeNav === "dashboard" || activeNav === "employees") && (
            <DashboardView activeNav={activeNav} />
          )}

          {activeNav === "history" && <HistoryView />}

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
                      <div className={`w-10 h-[22px] rounded-full relative cursor-pointer transition-colors ${n.on ? "bg-foreground" : "bg-secondary"}`}>
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
