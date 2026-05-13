import { NavLink } from "react-router-dom";
import "../styles/intranet-navbar.css";

import { useUser } from "../context/UserContext";

const navItems = [
  // Añadimos 'end: true' para que solo sea exacto
  { path: "/intranet", label: "INICIO", end: true },
  { path: "/intranet/fichajes", label: "FICHAJES" },
  { path: "/intranet/work-council", label: "COMITÉ DE EMPRESA" },
  { path: "/intranet/hr", label: "RECURSOS HUMANOS" },
  { path: "/intranet/tickets", label: "TICKETS" },
];

const IntranetNavbar = () => {
  const { customer } = useUser();
  return (
    <nav className="intranet-navbar">
      <div className="intranet-navbar-inner">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end} // Esto evita que 'Inicio' se quede siempre activo
            className={({ isActive }) =>
              isActive ? "intranet-nav-link active" : "intranet-nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}

        {customer?.role === "admin" && (
          <>
            <div className="intranet-nav-separator"></div>
            <NavLink
              to="/intranet/admin-users"
              className={({ isActive }) =>
                isActive ? "intranet-nav-link active" : "intranet-nav-link"
              }
            >
              USUARIOS (ADMIN)
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default IntranetNavbar;
