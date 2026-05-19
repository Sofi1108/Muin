import { NavHashLink as NavLink } from "react-router-hash-link";
import "../styles/intranet-navbar.css"; // Usar el mismo estilo

const workCouncilNavItems = [
  { path: "/intranet", label: "INICIO", end: true },
  { path: "/intranet/work-council", label: "PÁGINA COMITÉ", end: true },
  { path: "/intranet/news", label: "NOTICIAS" },
  { path: "/intranet/work-capsules", label: "PÍLDORAS INFORMATIVAS" },
  { path: "/intranet/legal-documents", label: "DOCUMENTOS LEGALES" },
];

const WorkCouncilNavbar = () => {
  return (
    <nav className="intranet-navbar">
      <div className="intranet-navbar-inner">
        {workCouncilNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={`${item.path}#intranet-header`}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "intranet-nav-link active" : "intranet-nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default WorkCouncilNavbar;