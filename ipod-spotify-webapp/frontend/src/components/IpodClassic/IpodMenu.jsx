import React from "react";

const IpodMenu = ({ title = "Menu", items = [], selectedIndex = 0 }) => {
  return (
    <div className="ipod-menu">
      <div className="ipod-menu-header">{title}</div>
      <ul className="ipod-menu-list">
        {items.map((item, index) => (
          <li
            key={index}
            className={`ipod-menu-item ${
              index === selectedIndex ? "selected" : ""
            }`}
          >
            {item}
            {index === selectedIndex && <span className="arrow">›</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IpodMenu;
