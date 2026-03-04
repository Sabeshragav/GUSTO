"use client";

import React from "react";

interface RegistrationTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: "auto",
  minWidth: "140px",
  padding: "10px 14px",
  background: "#1a1b23",
  border: "2px solid #2a2b35",
  borderRadius: "8px",
  color: "#e4e4e7",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export default function RegistrationTypeFilter({
  value,
  onChange,
}: RegistrationTypeFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    >
      <option value="">All Registrations</option>
      <option value="ONLINE">Online</option>
      <option value="ONSPOT">On-Spot</option>
    </select>
  );
}
