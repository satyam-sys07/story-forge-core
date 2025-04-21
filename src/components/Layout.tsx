import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-[3rem] lg:ml-0 transition-all duration-300">
          <div className="container max-w-6xl mx-auto">
            <div className="relative">
              <SidebarTrigger className="absolute top-0 left-0 md:hidden" />
              <div className="md:pl-0 pl-10">
                <div className="flex justify-end items-center mb-2">
                  {user && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await signOut();
                        navigate("/auth");
                      }}
                    >
                      Log Out
                    </Button>
                  )}
                </div>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
