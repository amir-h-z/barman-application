import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = "انتخاب زمان" }: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
  const [step, setStep] = useState<'hour' | 'minute'>('hour');
  const [isOpen, setIsOpen] = useState(false);

  // Parse current value
  const parseValue = (timeValue?: string) => {
    if (timeValue && timeValue.includes(':')) {
      const [hour, minute] = timeValue.split(':').map(Number);
      return { hour, minute };
    }
    return { hour: null, minute: null };
  };

  const { hour: currentHour, minute: currentMinute } = parseValue(value);

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    setStep('minute');
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    const finalHour = selectedHour !== null ? selectedHour : currentHour || 0;
    const timeString = `${finalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange?.(timeString);
    setIsOpen(false);
    setStep('hour');
    setSelectedHour(null);
    setSelectedMinute(null);
  };

  const formatTime = (value?: string) => {
    if (!value) return placeholder;
    return value;
  };

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i);
  };

  const generateMinutes = () => {
    return Array.from({ length: 12 }, (_, i) => i * 5);
  };

  const getClockPosition = (value: number, total: number) => {
    const angle = (value * 360) / total - 90; // -90 to start from top
    const radian = (angle * Math.PI) / 180;
    const radius = 80;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return { x, y };
  };

  const getHandAngle = (value: number, total: number) => {
    return (value * 360) / total - 90;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-input-background border-border text-center"
        >
          {formatTime(value)}
          <Clock className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-6" align="start">
        <div className="flex flex-col items-center">
          <div className="text-sm font-medium mb-4">
            {step === 'hour' ? 'انتخاب ساعت' : 'انتخاب دقیقه'}
          </div>
          
          <div className="relative w-40 h-40 mb-4">
            {/* Clock Circle */}
            <div className="absolute inset-0 rounded-full border-2 border-border bg-background" />
            
            {/* Clock Hand */}
            {step === 'hour' && (currentHour !== null || selectedHour !== null) && (
              <div
                className="absolute w-16 h-0.5 bg-primary origin-right transform"
                style={{
                  top: '50%',
                  right: '50%',
                  transform: `rotate(${getHandAngle(selectedHour !== null ? selectedHour : currentHour!, 24)}deg)`,
                  transformOrigin: 'right center'
                }}
              />
            )}
            
            {step === 'minute' && (currentMinute !== null || selectedMinute !== null) && (
              <div
                className="absolute w-16 h-0.5 bg-primary origin-right transform"
                style={{
                  top: '50%',
                  right: '50%',
                  transform: `rotate(${getHandAngle(selectedMinute !== null ? selectedMinute : currentMinute!, 60)}deg)`,
                  transformOrigin: 'right center'
                }}
              />
            )}
            
            {/* Clock Numbers */}
            {step === 'hour' ? (
              generateHours().map((hour) => {
                const { x, y } = getClockPosition(hour, 24);
                const isSelected = hour === currentHour || hour === selectedHour;
                return (
                  <button
                    key={hour}
                    onClick={() => handleHourSelect(hour)}
                    className={`absolute w-8 h-8 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 16px)`,
                      top: `calc(50% + ${y}px - 16px)`,
                    }}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                );
              })
            ) : (
              generateMinutes().map((minute) => {
                const { x, y } = getClockPosition(minute, 60);
                const isSelected = minute === currentMinute || minute === selectedMinute;
                return (
                  <button
                    key={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    className={`absolute w-8 h-8 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                    style={{
                      left: `calc(50% + ${x}px - 16px)`,
                      top: `calc(50% + ${y}px - 16px)`,
                    }}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                );
              })
            )}
            
            {/* Center Dot */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>

          {step === 'minute' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('hour')}
              className="mt-2"
            >
              بازگشت به ساعت
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}