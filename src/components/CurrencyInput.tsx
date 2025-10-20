"use client";

import { useState, useEffect } from "react";

type CurrencyInputProps = {
  placeholder?: string;
  value?: string; // clean numeric string
  onValueChange?: (val: string) => void;
  className?: string;
};

export function CurrencyInput({
  placeholder = "Amount",
  value = "",
  onValueChange,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState("");

  const strip = (v: string) => v.replace(/\D/g, "");
  const format = (v: string) =>
    v ? new Intl.NumberFormat("en-NG").format(Number(v)) : "";

  useEffect(() => {
    setDisplay(format(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = strip(e.target.value);
    onValueChange?.(digits); // send clean numeric string to parent
    setDisplay(digits);
  };

  const handleFocus = () => setDisplay(value);
  const handleBlur = () => setDisplay(format(value));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent highlighting
      e.currentTarget.form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pryGold pointer-events-none">
        ₦
      </span>

      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        className="input pl-8"
        value={display}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
