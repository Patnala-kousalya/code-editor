import { memo } from "react";

const Tabs = memo(function Tabs({ tabs, activeTab, onSelect }) {
  const handleKeyDown = (event, index) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;

    onSelect(tabs[nextIndex]);
  };

  return (
    <div className="tabs" role="tablist" aria-label="Editor files">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            id={`tab-${tab}`}
            className={`tab ${isActive ? "active" : ""}`}
            role="tab"
            type="button"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            aria-controls={`panel-${tab}`}
            onClick={() => onSelect(tab)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
});

export default Tabs;
