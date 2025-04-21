import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Categories from "./pages/Categories";
import Editor from "./pages/Editor";
import Archive from "./pages/Archive";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Auth from "@/pages/Auth";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/posts"
            element={
              <AuthGuard>
                <Layout>
                  <Posts />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/categories"
            element={
              <AuthGuard>
                <Layout>
                  <Categories />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/editor"
            element={
              <AuthGuard>
                <Layout>
                  <Editor />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/archive"
            element={
              <AuthGuard>
                <Layout>
                  <Archive />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Layout>
                  <Profile />
                </Layout>
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
