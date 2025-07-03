'use client';

import styled from '@emotion/styled';
import { Popover, Transition } from '@headlessui/react';
import { DayPicker, DayPickerSingleProps } from 'react-day-picker';
import { Fragment } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// --- Styled Components ---

const PopoverButton = styled(Popover.Button)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #ffffff;
  color: #374151;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: 2px solid #3b82f6;
    border-color: transparent;
  }
`;

const Placeholder = styled.span`
  color: #9ca3af;
`;

const PopoverPanel = styled(Popover.Panel)`
  position: absolute;
  z-index: 10;
  margin-top: 0.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const StyledDayPicker = styled(DayPicker)`
  /* react-day-picker의 내부 스타일을 일부 오버라이드 할 수 있습니다. */
  .rdp-caption_label {
    font-weight: bold;
  }
`;

// --- Component ---

// DayPicker의 기본 props와 우리가 추가할 props를 합칩니다.
interface DatePickerPopoverProps extends Omit<DayPickerSingleProps, 'mode'> {
  placeholder: string;
}

export function DatePickerPopover({ placeholder, selected, ...props }: DatePickerPopoverProps) {
  return (
    <Popover style={{ position: 'relative' }}>
      <PopoverButton>{selected ? format(selected as Date, 'PPP', { locale: ko }) : <Placeholder>{placeholder}</Placeholder>}</PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel>
          <StyledDayPicker mode="single" selected={selected} locale={ko} {...props} />
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
