import Icon from "@/components/ui/icon";
import { MANAGER, NAV_ITEMS } from "./data";

interface SidebarProps {
  activeNav: string;
  setActiveNav: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (fn: (v: boolean) => boolean) => void;
}

export default function Sidebar({ activeNav, setActiveNav, sidebarCollapsed, setSidebarCollapsed }: SidebarProps) {
  return (
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
  );
}
