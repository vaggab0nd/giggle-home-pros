import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ContractorSidebar } from "@/components/contractor/ContractorSidebar";
import { ActiveBids } from "@/components/contractor/ActiveBids";
import { ProfileSettings } from "@/components/contractor/ProfileSettings";
import { Verification } from "@/components/contractor/Verification";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "": { title: "Active Bids", description: "Track and manage your submitted bids." },
  settings: { title: "Profile Settings", description: "Update your business details and verification." },
  verification: { title: "Verification", description: "Manage your license and insurance credentials." },
};

function PageHeader({ segment }: { segment: string }) {
  const meta = PAGE_META[segment] ?? PAGE_META[""];
  return (
    <header className="h-16 flex items-center gap-4 border-b border-border px-6 bg-card shrink-0">
      <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-foreground" />
      <div className="h-5 w-px bg-border" />
      <div>
        <h1 className="text-base font-heading font-bold text-foreground leading-tight">{meta.title}</h1>
        <p className="text-xs text-muted-foreground">{meta.description}</p>
      </div>
    </header>
  );
}

function useSegment() {
  const loc = useLocation();
  const parts = loc.pathname.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] === "profile" ? "" : parts[parts.length - 1];
}

const ContractorProfile = () => {
  const segment = useSegment();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30">
        <ContractorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <PageHeader segment={segment} />
          <Routes>
            <Route
              index
              element={
                <main className="flex-1 p-6 md:p-8 max-w-5xl w-full">
                  <ActiveBids />
                </main>
              }
            />
            <Route
              path="settings"
              element={
                <main className="flex-1 p-6 md:p-8 max-w-2xl w-full">
                  <ProfileSettings />
                </main>
              }
            />
            <Route
              path="verification"
              element={
                <main className="flex-1 p-6 md:p-8 max-w-2xl w-full">
                  <Verification />
                </main>
              }
            />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ContractorProfile;
