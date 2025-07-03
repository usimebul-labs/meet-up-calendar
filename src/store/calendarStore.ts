import { create } from 'zustand';
import { eachDayOfInterval, format } from 'date-fns';

type CalendarState = {
  selectedDates: Set<string>;
  actions: {
    // 클릭 이벤트만 처리하는 단일 액션
    toggleDateSelection: (dateStr: string) => void;
    clearSelection: () => void;
  };
};
export const useCalendarStore = create<CalendarState>((set, get) => ({
  selectedDates: new Set(),
  actions: {
    /**
     * 특정 날짜의 선택 상태를 토글(toggle)합니다.
     * @param dateStr - 'yyyy-MM-dd' 형식의 날짜 문자열
     */
    toggleDateSelection: (dateStr) => {
      // get()을 사용하여 항상 최신 상태를 기반으로 작업합니다.
      const currentSelection = get().selectedDates;
      const newSelection = new Set(currentSelection);

      if (newSelection.has(dateStr)) {
        // 이미 선택된 날짜면 선택 해제
        newSelection.delete(dateStr);
      } else {
        // 선택되지 않은 날짜면 선택 추가
        newSelection.add(dateStr);
      }
      
      // 새로운 Set으로 상태를 업데이트합니다.
      set({ selectedDates: newSelection });
    },

    /**
     * 모든 선택을 해제합니다.
     */
    clearSelection: () => set({ selectedDates: new Set() }),
  },
}));

// 액션 훅 이름도 더 명확하게 변경합니다.
export const useCalendarActions = () => useCalendarStore((state) => state.actions);
