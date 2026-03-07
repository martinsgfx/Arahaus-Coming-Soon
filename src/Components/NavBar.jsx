import React from "react";
import instagramIcon from '../assets/instagram.svg';
import arahausLogo from '../assets/arahaus-logo.png';

export const NavBar = () => {
  return (
    <div className="flex justify-between items-center">
      <a href="https://arahaus.com" className="cursor-pointer inline-block" target="_blank" rel="noopener noreferrer">
        <img
          src={arahausLogo}
          alt="Arahaus Logo"
          className="h-10 w-auto pointer-events-auto transition-transform duration-200 hover:scale-105 "
        />
      </a>

      <a href="https://www.instagram.com/arahaus_hq/" className="cursor-pointer inline-block" target="_blank" rel="noopener noreferrer">
        <img
          src={instagramIcon}
          alt="Instagram Logo"
          className="h-8 w-8 pointer-events-auto transition-transform duration-200 hover:scale-110 "
        />
      </a>
    </div>
  );
};
