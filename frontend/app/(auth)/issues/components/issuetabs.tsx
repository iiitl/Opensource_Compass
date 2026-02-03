"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["Saved", "In Progress", "Submitted", "Completed"];

export default function IssueTabs() {
  const [active, setActive] = useState("Saved");

  return (
    <div className="flex gap-2 border-b border-[#30363d]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={cn(
            "pb-2 text-sm transition-colors",
            active === tab
              ? "text-[#c9d1d9] border-b-2 border-[#2f81f7]"
              : "text-[#8b949e] hover:text-[#c9d1d9]"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
