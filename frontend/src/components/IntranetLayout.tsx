import type { ReactNode } from "react";
import IntranetNavbar from "./IntranetNavbar";
import "../styles/intranet-layout.css";
import HeroSectionIntranet from "./HeroSectionIntranet";

interface IntranetLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const IntranetLayout = ({ title, subtitle, children }: IntranetLayoutProps) => {
  return (
    <div className="intranet-page-wrapper">
      <HeroSectionIntranet />
      <IntranetNavbar />
      <main className="intranet-page-content">{children}</main>
    </div>
  );
};

export default IntranetLayout;
