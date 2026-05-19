import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";
import IntranetNavbar from "./IntranetNavbar";
import "../styles/intranet-layout.css";

interface IntranetLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const IntranetLayout = ({ title, subtitle, children }: IntranetLayoutProps) => {
  const { customer } = useUser();
  const userName = customer?.name || "Usuario";

  return (
    <div className="intranet-page-wrapper">
      <div className="intranet-top-welcome">
        <span>Bienvenido/a, {userName}</span>
      </div>
      <IntranetNavbar />
      <main className="intranet-page-content">{children}</main>
    </div>
  );
};

export default IntranetLayout;
