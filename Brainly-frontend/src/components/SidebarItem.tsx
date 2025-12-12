// src/components/SidebarItem.tsx
import type { ReactElement } from "react";

export function SidebarItem({
  text,
  icon,
}: {
  text: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex w-full items-center relative justify-between py-5 gap-2 text-gray-700 cursor-default rounded max-w-48 pl-4 transition-all duration-150">
      <h1 className="text-2xl">{text}</h1>
      <span className="absolute right-0 bottom-3.5 flex items-center text-2xl text-gray-400">
        {icon}
      </span>
    </div>
  );
}
