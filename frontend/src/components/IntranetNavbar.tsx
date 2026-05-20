import React, { useState } from "react";
import { NavHashLink as NavLink } from "react-router-hash-link";
import "../styles/intranet-navbar.css";

import { useUser } from "../context/UserContext";

const IntranetNavbar = () => {
  const { customer } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    ...(customer?.role !== "cliente" ? [
      { path: "/intranet", label: "INICIO", end: true },
      { path: "/intranet/fichajes", label: "FICHAJE" },
      { path: "/intranet/work-council", label: "PÁGINA COMITÉ" },
      { path: "/intranet/hr", label: "RECURSOS HUMANOS" },
      { path: "/intranet/tickets", label: "TICKETS" },
    ] : []),
  ];

  return (
    <nav className="intranet-navbar">
      <div className="intranet-navbar-inner">
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>

        <div className={`intranet-nav-links ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`${item.path}#intranet-header`}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "intranet-nav-link active" : "intranet-nav-link"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          {customer?.role === "admin" && (
            <>
              <div className="intranet-nav-separator"></div>
              <NavLink
                to="/intranet/admin-users#intranet-header"
                className={({ isActive }) =>
                  isActive ? "intranet-nav-link active" : "intranet-nav-link"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                USUARIOS
              </NavLink>
              <NavLink
                to="/intranet/admin-designs#intranet-header"
                className={({ isActive }) =>
                  isActive ? "intranet-nav-link active" : "intranet-nav-link"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                DISEÑOS
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default IntranetNavbar;
