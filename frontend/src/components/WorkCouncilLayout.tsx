import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";
import WorkCouncilNavbar from "./WorkCouncilNavbar";
import "../styles/intranet-layout.css";

interface WorkCouncilLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const WorkCouncilLayout = (props: WorkCouncilLayoutProps) => {
  const { children } = props;
  const { customer } = useUser();
  const userName = customer?.name || "Usuario";

  return (
    <div className="intranet-page-wrapper" id="intranet-header">
      <div className="intranet-top-welcome">
        <span>Bienvenido/a, {userName}</span>
      </div>
      <WorkCouncilNavbar />
      <main className="intranet-page-content">{children}</main>
    </div>
  );
};

export default WorkCouncilLayout;