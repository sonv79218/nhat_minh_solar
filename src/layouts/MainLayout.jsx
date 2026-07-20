import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FloatingContactButtons from "../components/layout/FloatingContactButtons";
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />

        <main className="flex-1 overflow-visible pt-[75px] lg:pt-0">
          <div className="w-full lg:max-w-[1200px] lg:mx-auto">
            {children}
          </div>
        </main>

      <Footer />
      <FloatingContactButtons />
    </div>
  );
};

export default MainLayout;
