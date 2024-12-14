import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Footer from "@/components/Footer";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <div className="nonDashboard-layout">
      <NonDashboardNavbar/>
      <main className="nonDashboard-layout__main ">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
