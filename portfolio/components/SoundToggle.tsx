"use client";

import { useState } from "react";
import { setSound } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className="sound"
      aria-pressed={on}
      onClick={() => {
        setSound(!on);
        setOn(!on);
      }}
    >
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
