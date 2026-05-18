import type { ReactNode } from "react";
import WorkCouncilNavbar from "./WorkCouncilNavbar";
import "../styles/intranet-layout.css";
import HeroSectionIntranet from "./HeroSectionIntranet";

interface WorkCouncilLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const WorkCouncilLayout = ({ title, subtitle, children }: WorkCouncilLayoutProps) => {
  return (
    <div className="intranet-page-wrapper">
      <HeroSectionIntranet />
      <WorkCouncilNavbar />
      <main className="intranet-page-content">{children}</main>
    </div>
  );
};

export default WorkCouncilLayout;