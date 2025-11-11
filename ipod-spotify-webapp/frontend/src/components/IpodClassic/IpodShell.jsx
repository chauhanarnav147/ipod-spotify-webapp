import React, { useState, useEffect } from "react";
import "./Ipod.css";
import IpodMenu from "./IpodMenu";
import IpodWheel from "./IpodWheel";
import clickSound from "/sounds/select.mp3";
import scrollSound from "/sounds/scroll.mp3";
import backSound from "/sounds/back.mp3";

const IpodShell = ({ playlists = [], onSelectPlaylist, onLogout, onRequestAuth }) => {
  const [menuIndex, setMenuIndex] = useState(0);
  const [menu, setMenu] = useState("main"); // "main" | "playlists" | "nowPlaying"
  const [audio] = useState({
    click: new Audio(clickSound),
    scroll: new Audio(scrollSound),
    back: new Audio(backSound),
  });

  const mainMenu = ["Playlists", "Now Playing", "Logout"];

  const handleScroll = (direction) => {
    setMenuIndex((prev) => {
      let next = direction === "up" ? prev - 1 : prev + 1;
      const menuLength = menu === "main" ? mainMenu.length : playlists.length;
      if (next < 0) next = menuLength - 1;
      if (next >= menuLength) next = 0;
      audio.scroll.play();
      return next;
    });
  };

  const handleSelect = () => {
    audio.click.play();

    if (menu === "main") {
      const choice = mainMenu[menuIndex];
      if (choice === "Playlists") setMenu("playlists");
      else if (choice === "Now Playing") setMenu("nowPlaying");
      else if (choice === "Logout" && onLogout) onLogout();
    } else if (menu === "playlists") {
      const selected = playlists[menuIndex];
      if (onSelectPlaylist) onSelectPlaylist(selected);
    }
  };

  const handleBack = () => {
    if (menu !== "main") {
      audio.back.play();
      setMenu("main");
      setMenuIndex(0);
    }
  };

  return (
    <div className="ipod-shell">
      <div className="ipod-screen">
        {menu === "main" && (
          <IpodMenu title="Menu" items={mainMenu} selectedIndex={menuIndex} />
        )}
        {menu === "playlists" && (
          <IpodMenu
            title="Playlists"
            items={playlists.map((p) => p.name)}
            selectedIndex={menuIndex}
          />
        )}
        {menu === "nowPlaying" && (
          <div className="now-playing">
            <p>No track currently playing</p>
          </div>
        )}
      </div>

      <IpodWheel
        onScroll={handleScroll}
        onSelect={handleSelect}
        onBack={handleBack}
      />

      {!playlists?.length && (
        <button className="connect-btn" onClick={onRequestAuth}>
          Connect Spotify
        </button>
      )}
    </div>
  );
};

export default IpodShell;
