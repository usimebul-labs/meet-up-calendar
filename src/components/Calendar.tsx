import React, { useState } from "react";
import { colors } from "../styles/tokens/colors";
import { typography } from "../styles/tokens/typography";
import { spacing } from "../styles/tokens/spacing";

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export type CalendarProps = {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
};

export const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((y) => y - 1);
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  };

  const handleDateClick = (day: number) => {
    if (onDateSelect) {
      onDateSelect(new Date(currentYear, currentMonth, day));
    }
  };

  // 오늘 날짜 구하기
  const isToday = (day: number) => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day
    );
  };

  return (
    <div
      style={{
        background: colors.background,
        borderRadius: 24,
        padding: spacing.xl,
        width: 380,
        fontFamily: typography.fontFamily,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg }}>
        <button
          onClick={handlePrevMonth}
          style={{
            background: colors.background,
            border: "none",
            fontSize: typography.fontSize.xl,
            cursor: "pointer",
            color: colors.text,
            borderRadius: 12,
            width: 40,
            height: 40,
            transition: "background 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = colors.secondary)}
          onMouseOut={e => (e.currentTarget.style.background = colors.background)}
        >
          &#60;
        </button>
        <span style={{ fontWeight: typography.fontWeight.bold, fontSize: typography.fontSize.xl, color: colors.text }}>
          {currentYear}년 {currentMonth + 1}월
        </span>
        <button
          onClick={handleNextMonth}
          style={{
            background: colors.background,
            border: "none",
            fontSize: typography.fontSize.xl,
            cursor: "pointer",
            color: colors.text,
            borderRadius: 12,
            width: 40,
            height: 40,
            transition: "background 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = colors.secondary)}
          onMouseOut={e => (e.currentTarget.style.background = colors.background)}
        >
          &#62;
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: spacing.sm, marginBottom: spacing.md }}>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              color: colors.disabled,
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.medium,
              letterSpacing: 0.5,
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: spacing.sm }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={"empty-" + i} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = selectedDate &&
            selectedDate.getFullYear() === currentYear &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getDate() === day;
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              style={{
                background: isSelected
                  ? colors.primary
                  : isToday(day)
                  ? colors.secondary
                  : colors.background,
                color: isSelected
                  ? colors.background
                  : isToday(day)
                  ? colors.primary
                  : colors.text,
                border: "none",
                borderRadius: 16,
                width: 48,
                height: 48,
                fontSize: typography.fontSize.lg,
                fontFamily: typography.fontFamily,
                fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.regular,
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
                margin: "0 auto",
                boxShadow: isSelected ? "0 2px 8px 0 rgba(49,130,246,0.08)" : undefined,
              }}
              onMouseOver={e => {
                if (!isSelected) e.currentTarget.style.background = colors.secondary;
              }}
              onMouseOut={e => {
                if (!isSelected) e.currentTarget.style.background = isToday(day) ? colors.secondary : colors.background;
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 