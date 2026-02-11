import { memo } from "react";

const StatusBar = memo(function StatusBar({ status }) {
  return <footer className="status-bar">{status}</footer>;
});

export default StatusBar;
