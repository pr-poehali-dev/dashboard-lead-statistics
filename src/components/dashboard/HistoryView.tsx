import { useState } from "react";
import Icon from "@/components/ui/icon";
import { HISTORY } from "./data";

export default function HistoryView() {
  const [historyFilter, setHistoryFilter] = useState("");

  const filteredHistory = HISTORY.filter(
    (h) =>
      historyFilter === "" ||
      h.employee.toLowerCase().includes(historyFilter.toLowerCase()) ||
      h.field.toLowerCase().includes(historyFilter.toLowerCase())
  );

  return (
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
  );
}
