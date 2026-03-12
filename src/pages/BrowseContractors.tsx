import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BrowseContractors = () => (
  <div className="min-h-screen flex flex-col page-bg">
    <Navbar variant="solid" />
    <main className="flex-1 max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold font-heading text-foreground mb-6">Browse Contractors</h1>
      <p className="text-2xl text-muted-foreground">This feature is not built yet.</p>
    </main>
    <Footer />
  </div>
);

export default BrowseContractors;
