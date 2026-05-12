import Icon from "@/components/ui/icon";
import { MissingStat } from "./data";

interface NotificationStackProps {
  notifications: MissingStat[];
  setNotifications: (fn: (prev: MissingStat[]) => MissingStat[]) => void;
}

export default function NotificationStack({ notifications, setNotifications }: NotificationStackProps) {
  return (
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
  );
}
