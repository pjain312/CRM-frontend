import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "Select time",
  disabled = false,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const [localHour, setLocalHour] = React.useState("");
  const [localMinute, setLocalMinute] = React.useState("");
  const [localPeriod, setLocalPeriod] = React.useState("");

  const parseTime = (timeString) => {
    if (!timeString) return { hour: "", minute: "", period: "" };

    // Try 12-hour format first: "H:MM AM/PM"
    const m12 = timeString.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (m12) {
      const hour12 = m12[1];
      const minute = m12[2];
      const period = m12[3].toUpperCase();
      return { hour: hour12, minute, period };
    }

    // Fallback: 24-hour format "HH:MM"
    const m24 = timeString.match(/^(\d{2}):(\d{2})$/);
    if (m24) {
      const hour24 = Number.parseInt(m24[1]);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const minute = m24[2];
      const period = hour24 >= 12 ? "PM" : "AM";
      return { hour: hour12.toString(), minute, period };
    }

    // Unrecognized format
    return { hour: "", minute: "", period: "" };
  };
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const periodOptions = ["AM", "PM"];

  React.useEffect(() => {
    if (open) {
      const parsed = parseTime(time);
      setLocalHour(parsed.hour);
      setLocalMinute(parsed.minute);
      setLocalPeriod(parsed.period);
    }
  }, [open, time]);

  const handleLocalChange = (newHour, newMinute, newPeriod) => {
    if (typeof newHour !== "undefined") setLocalHour(newHour);
    if (typeof newMinute !== "undefined") setLocalMinute(newMinute);
    if (typeof newPeriod !== "undefined") setLocalPeriod(newPeriod);
  };

  const applyTime = () => {
    const formattedTime = formatTime24(localHour, localMinute, localPeriod);
    onTimeChange?.(formattedTime);
    setOpen(false);
  };

  const formatTime24 = (hour12, minute, period) => {
    if (!hour12 || !minute || !period) return undefined;
    const h = Number.parseInt(hour12, 10);
    // Convert 12-hour to 24-hour
    let hh = h % 12; // 12 becomes 0
    if (period.toUpperCase() === "PM") hh += 12;
    const hhStr = String(hh).padStart(2, "0");
    return `${hhStr}:${minute}`;
  };

  const displayTime = React.useMemo(() => {
    if (!time) return placeholder;
    const { hour, minute, period } = parseTime(time);
    return hour && minute && period
      ? `${hour}:${minute} ${period}`
      : placeholder;
  }, [time, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-4",
            !time && "text-muted-foreground",
            "border-2 border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
          <span className="flex-1">{displayTime}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 border-2 border-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        <div className="space-y-4">
          <div className="text-sm font-medium text-foreground mb-3">
            Select Time
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Hour
              </label>
              <Select
                value={localHour}
                onValueChange={(value) =>
                  handleLocalChange(value, undefined, undefined)
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Minute
              </label>
              <Select
                value={localMinute}
                onValueChange={(value) =>
                  handleLocalChange(undefined, value, undefined)
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Period
              </label>
              <Select
                value={localPeriod}
                onValueChange={(value) =>
                  handleLocalChange(undefined, undefined, value)
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalHour("");
                setLocalMinute("");
                setLocalPeriod("");
                onTimeChange?.(undefined);
                setOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={applyTime}
              disabled={!localHour || !localMinute || !localPeriod}
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
