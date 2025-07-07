import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "DesignSystem/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const WithSelectedDate: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
    );
  },
}; 