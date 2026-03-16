import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ContractorSidebar } from "@/components/contractor/ContractorSidebar";
import { ActiveBids } from "@/components/contractor/ActiveBids";
import { ProfileSettings } from "@/components/contractor/ProfileSettings";
import { Verification } from "@/components/contractor/Verification";

const titles: Record<string, string> = {
  "": "Active Bids",
  settings: "Profile Settings",
  verification: "Verification",
};

function PageHeader({ title }: { title: string }) {
  return (
    <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card">
      <SidebarTrigger className="shrink-0" />
      <h1 className="text-lg font-heading font-bold text-foreground">{title}</h1>
    </header>
  );
}

const ContractorProfile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <ContractorSidebar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route
              index
              element={
                <>
                  <PageHeader title="Active Bids" />
                  <main className="flex-1 p-6 max-w-5xl"><ActiveBids /></main>
                </>
              }
            />
            <Route
              path="settings"
              element={
                <>
                  <PageHeader title="Profile Settings" />
                  <main className="flex-1 p-6 max-w-3xl"><ProfileSettings /></main>
                </>
              }
            />
            <Route
              path="verification"
              element={
                <>
                  <PageHeader title="Verification" />
                  <main className="flex-1 p-6 max-w-3xl"><Verification /></main>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContractorProfile;
