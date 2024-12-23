import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Landing from "./(nonDashboard)/landing/page";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="nonDashboard-layout">
      <NonDashboardNavbar/>
      <main className="nonDashboard-layout__main ">
        <Landing/>
      </main>
      <Footer/>
    </div>
  );
}
