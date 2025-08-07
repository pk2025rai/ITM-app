import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.webp";
import "../../App.css";
import "../../media.css";

const SidebarLayout = ({ links, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen(false);

  return (
    <nav
      className="navbar"
      style={{
        position: "relative",
        height: "80px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
        zIndex: 1000,
      }}
    >
      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute",
          right: "170px",
          top: "30%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          color: "#333",
          zIndex: 1001,
        }}
      >
        ☰
      </button>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="logos"
        style={{
          height: "50px",
        }}
      />

      {/* Nav Links */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        {links.map((link, index) =>
          link.to ? (
            <Link key={index} to={link.to} className="link" onClick={handleClick}>
              {link.label}
            </Link>
          ) : (
            <button key={index} onClick={onLogout} className="logout-button">
              {link.label}
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default SidebarLayout;
