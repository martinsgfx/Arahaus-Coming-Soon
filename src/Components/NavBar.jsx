import React from "react";

export const NavBar = () => {
  return (
    <div className="flex justify-between items-center">
      <img
        src="src/assets/arahaus-logo.png"
        alt="Arahaus Logo"
        className="h-10 w-auto "
      />

      <a href="https://www.instagram.com/arahaus_hq/">
        <img
          src="src/assets/instagram.svg"
          alt="Instagram Logo"
          className="h-8 w-8 ml-4"
        />
      </a>
    </div>
  );
};
